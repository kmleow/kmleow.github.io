---
title: "Platform Engineering: Architecting Ephemeral, Containerized CI/CD Runners on Constrained Hardware"
description: "Designing cost-effective, secure, and isolated hybrid build infrastructure using Docker daemon sandboxing, local image layer caching, and dynamic job execution."
pubDate: 2017-10-02
updatedDate: 2026-11-07
heroImage: "/images/heroes/containerized-cicd-runners.svg"
heroAlt: "Architecture diagram of hybrid ephemeral containerized CI/CD runners"
category: "Platform Engineering"
tags: ["DevOps", "Docker", "CI/CD", "Platform Engineering", "Infrastructure"]
legacyUrls:
  - "/2017/10/02/byod-ci-cd-build-machine-to-run-pipelines-using-docker/"
---

In modern software organizations, CI/CD pipeline efficiency directly governs developer velocity. However, engineering leaders frequently grapple with a frustrating trade-off: public shared cloud runners (such as GitLab.com shared runners or GitHub Actions) suffer from shared queue latency, strict monthly minute quotas, and bandwidth transfer caps. Conversely, provisioning 24/7 dedicated cloud virtual machines incurs persistent idle compute costs.

An alternative architectural model is **Bring Your Own Device (BYOD) CI/CD**: deploying self-hosted, ephemeral containerized runners on existing private hardware or homelab clusters.

By orchestrating the GitLab/GitHub runner daemon with the local Docker engine, teams can achieve zero-wait job dispatch, deterministic build environments, and full control over local caching—even on low-power System-on-Chip (SoC) hardware.

---

## Architectural Topology

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 External Cloud (SaaS)                  │
                  │                                                        │
                  │  [ GitLab / GitHub Repo ] ──> [ Pipeline Job Queue ]   │
                  └───────────────────────────────────┬────────────────────┘
                                                      │ HTTPS Polling
                                                      │ (Outbound Only - No Ingress Ports)
                  ┌───────────────────────────────────▼────────────────────┐
                  │            On-Premises / Homelab Build Host            │
                  │                                                        │
                  │  ┌──────────────────────────────────────────────────┐  │
                  │  │          GitLab Runner Host Daemon               │  │
                  │  └──────────────────────┬───────────────────────────┘  │
                  │                         │ /var/run/docker.sock         │
                  │                         ▼                              │
                  │  ┌──────────────────────────────────────────────────┐  │
                  │  │           Local Docker Engine Daemon             │  │
                  │  │  ┌────────────────────┐  ┌────────────────────┐  │  │
                  │  │  │ Ephemeral Job 1    │  │ Ephemeral Job 2    │  │  │
                  │  │  │ Container          │  │ Container          │  │  │
                  │  │  │ (Hugo / Node.js)   │  │ (Go / Dotnet Core) │  │  │
                  │  │  └────────────────────┘  └────────────────────┘  │  │
                  │  └──────────────────────────────────────────────────┘  │
                  └────────────────────────────────────────────────────────┘
```

---

## Critical Security Principles for Self-Hosted Runners

Deploying self-hosted runners requires strict adherence to security boundaries:

1. **Zero Inbound Network Exposure**:
   The runner daemon establishes persistent outbound HTTPS long-polling connections (`443`) to the orchestrator. **No ingress firewall ports should ever be opened** on your edge router.
2. **Ephemeral Container Sandboxing**:
   Never configure the runner with the raw `shell` executor, which executes pipeline scripts directly on the host operating system with runner user privileges. Instead, enforce the `docker` executor so every job executes inside a clean, disposable container filesystem.
3. **Protecting the Docker Socket (`/var/run/docker.sock`)**:
   Exposing the Docker socket into untrusted containers grants root-equivalent control over the host. Self-hosted runners executing untrusted public pull requests must run within isolated network zones or isolated microVMs (such as Firecracker or gVisor).

---

## Deploying the Runner Daemon

### Step 1: Install the Runner on Linux

Download and install the native daemon binary:

```bash
# Fetch runner binary for your architecture (x86_64 or ARM64)
sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-arm

# Make executable and register daemon service
sudo chmod +x /usr/local/bin/gitlab-runner
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
sudo usermod -aG docker gitlab-runner
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start
```

### Step 2: Register the Runner with Docker Executor

Execute the registration wizard:

```bash
sudo gitlab-runner register
```

Provide the registration parameters:
- **GitLab instance URL**: `https://gitlab.com/` (or your private self-hosted instance).
- **Registration Token**: Acquired from Project Settings > CI/CD > Runners.
- **Description**: `homelab-arm-runner-01`.
- **Tags**: `docker, arm64, linux`.
- **Executor**: `docker`.
- **Default Docker Image**: `alpine:latest`.

The runner automatically generates `/etc/gitlab-runner/config.toml`:

```toml
concurrent = 2
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "homelab-arm-runner-01"
  url = "https://gitlab.com/"
  id = 10429
  token = "glrt-xxxxxxxxxxxxxxxxxxxx"
  token_obtained_at = 2017-10-02T12:00:00Z
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "docker"
  [runners.custom_build_dir]
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
```

---

## Infrastructure Tuning: Storage I/O Bottlenecks

A major failure mode when deploying CI/CD runners on low-power devices (such as single-board computers or network storage arrays) is storage latency.

### The USB / Flash Storage Failure Mode

In an initial deployment, we attempted to direct the Docker `data-root` to an external USB flash drive to preserve internal micro SD card longevity. 

During concurrent pipeline runs, jobs began failing with the following error:

```text
ERROR: Job failed (system failure): Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

Diagnostic investigation revealed that cheap USB mass storage controllers exhibit severe I/O stall spikes during unbuffered write bursts. When Docker unpacks multiple container layers simultaneously, the Linux kernel entered extended `D-state` (uninterruptible sleep) disk wait. The Docker daemon failed to respond to runner socket heartbeats within the timeout threshold, prompting the orchestrator to mark the job as crashed.

### The Fix: Storage Engine Optimization

1. **Leverage Native Storage Drivers**:
   Ensure Docker uses the `overlay2` storage driver, which operates with minimal metadata overhead compared to legacy `vfs` or `devicemapper`.
2. **Dedicated Fast Flash or SSD via SATA/NVMe**:
   Relocate `/var/lib/docker` to a high-endurance Class 10 / A2-rated micro SD card or dedicated SSD attached via native bus:

```json
// /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "data-root": "/var/lib/docker",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

Following this storage reorganization, pipeline execution times dropped by **over 55%**, and socket disconnect errors vanished entirely.

---

## Automated Maintenance & Cache Hygiene

Because self-hosted runners continuously download Docker images, unmanaged hosts will eventually exhaust disk capacity.

Create a nightly maintenance script at `/etc/cron.daily/docker-cleanup`:

```bash
#!/bin/sh
# Prune dangling build containers and intermediate layers older than 7 days
docker container prune -f --filter "until=168h"
docker image prune -a -f --filter "until=168h"
docker volume prune -f
```

---

## Architectural Takeaways for Engineering Leaders

1. **Hybrid Infrastructure Reduces Cloud Spend**: Running resource-intensive, iterative build/test cycles on self-hosted infrastructure while deploying release artifacts to serverless edge platforms (like GitHub Pages or Cloudflare) provides the ideal balance between zero marginal compute costs and enterprise reliability.
2. **I/O Latency Matters More Than CPU Frequency**: In CI/CD workloads, disk write throughput and random 4K I/O during layer extraction dominate build duration far more than raw clock speed.
3. **Consistent Containerized Toolchains**: Enforcing containerized runner executors eliminates the dreaded *"it works on my machine"* syndrome by ensuring production builds run in identical container environments regardless of host topology.

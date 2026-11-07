---
title: "Taming Bufferbloat: Packet Scheduling, Fair Queuing, and Active Queue Management with SQM"
description: "A deep dive into mitigating queue latency under saturation using modern Smart Queue Management algorithms (CAKE and fq_codel) in embedded Linux."
pubDate: 2018-08-11
updatedDate: 2026-11-07
heroImage: "/images/heroes/bufferbloat-sqm.svg"
heroAlt: "Diagram comparing unmanaged FIFO tail-drop latency with CAKE smart queuing"
category: "Networking & Kernel"
tags: ["Networking", "Bufferbloat", "QoS", "Linux", "OpenWRT"]
legacyUrls:
  - "/2018/08/11/reduce-internet-lag-on-openwrt/"
---

One of the most pervasive yet misunderstood failure modes in modern IP networks is **Bufferbloat**: the introduction of massive, uncontrollable packet latency caused by oversized, unmanaged First-In, First-Out (FIFO) buffers in residential modems and routers.

When a network connection is saturated by high-bandwidth bulk data transfers (such as a large backup sync, ISO download, or software distribution), the bottleneck queue fills to capacity. Latency-sensitive traffic—such as VoIP packets, DNS lookups, and TCP ACK frames—gets trapped behind thousands of queued bulk packets. The resulting round-trip time (RTT) spikes from single-digit milliseconds to hundreds or thousands of milliseconds.

Solving this does not require purchasing additional bandwidth. Instead, it requires implementing modern **Active Queue Management (AQM)** and **Fair Queuing (FQ)** via Smart Queue Management (SQM).

---

## Measuring Bufferbloat: Baseline Telemetry

To observe the real-world impact of bufferbloat, we ran a continuous ICMP probe against a resilient target (`8.8.8.8`) on an unmanaged 100 Mbps downstream / 50 Mbps upstream fiber link while initiating an unscheduled line-rate saturating transfer:

```text
64 bytes from 8.8.8.8: seq=10 ttl=124 time=3.321 ms
64 bytes from 8.8.8.8: seq=11 ttl=124 time=3.488 ms
64 bytes from 8.8.8.8: seq=12 ttl=124 time=3.539 ms
[ Transfer Initiated - Bottleneck Buffer Inundated ]
64 bytes from 8.8.8.8: seq=13 ttl=124 time=24.593 ms
64 bytes from 8.8.8.8: seq=14 ttl=124 time=21.562 ms
64 bytes from 8.8.8.8: seq=15 ttl=124 time=50.528 ms
64 bytes from 8.8.8.8: seq=16 ttl=124 time=50.492 ms
64 bytes from 8.8.8.8: seq=17 ttl=124 time=48.279 ms
64 bytes from 8.8.8.8: seq=18 ttl=124 time=42.630 ms
64 bytes from 8.8.8.8: seq=19 ttl=124 time=53.913 ms
64 bytes from 8.8.8.8: seq=20 ttl=124 time=40.759 ms
[ Transfer Concluded - Buffer Drained ]
64 bytes from 8.8.8.8: seq=24 ttl=124 time=5.479 ms
64 bytes from 8.8.8.8: seq=25 ttl=124 time=5.117 ms
```

Latency experienced a **16x degradation** (from 3.3 ms to nearly 54 ms). On connections with deeper ISP buffers (such as cable DOCSIS or VDSL modems), bufferbloat frequently causes spikes in excess of 400 ms, completely destroying interactive session quality.

---

## The Solution: Active Queue Management & Fair Queuing

Traditional tail-drop queues allow buffers to fill completely before blindly dropping subsequent packets. By that point, the delay damage is already done, and TCP connections enter synchronized window collapses.

Modern Smart Queue Management (SQM) solves this through two complementary techniques:

1. **Fair Queuing (FQ)**: Divides incoming and outgoing traffic into independent flow queues using hash buckets. Light, sparse flows (like DNS queries, SSH keystrokes, and gaming packets) are isolated from dense, heavy flows (like torrents or video streams) and forwarded immediately without waiting behind bulk buffers.
2. **Controlled Delay (CoDel) / AQM**: Actively monitors the persistent standing queue time. When packets linger in the buffer longer than a target duration (typically 5 ms), the queue proactively drops a packet or marks it with Explicit Congestion Notification (ECN). This signals the TCP sender's congestion window to scale back *before* the buffer overflows.

```
Unmanaged Tail-Drop Buffer (FIFO):
[ Bulk Pkt ][ Bulk Pkt ][ Bulk Pkt ][ Bulk Pkt ][ Bulk Pkt ][ DNS Query ] ──> Huge Latency Spike

Smart Queue Management (CAKE / FQ-CoDel):
Flow 1 (Bulk)  : [ Bulk Pkt ][ Bulk Pkt ][ Bulk Pkt ] ──> Throttled & Paced
Flow 2 (Sparse): [ DNS Query ]                        ──> Emitted Immediately (Zero Wait)
```

### Choosing the Queue Discipline: CAKE vs. fq_codel

OpenWRT offers two primary disciplines:

- **`fq_codel`**: The classic standard (RFC 8290). Highly efficient and effective.
- **`CAKE` (Common Applications Kept Enhanced)**: The successor designed by the bufferbloat research team. CAKE combines packet scheduling, fair queuing across hosts, and automatic link-layer framing overhead compensation into a single monolithic queuing discipline (`qdisc`), resulting in lower configuration complexity and superior fairness.

---

## Production Setup on OpenWRT

### Step 1: Install SQM Packages

```bash
opkg update
opkg install sqm-scripts luci-app-sqm
```

### Step 2: Establish True Bottleneck Control

For SQM to work, the queue **must live on your router**, not upstream in the ISP's black-box modem buffer. Therefore, you must deliberately configure the router's egress and ingress shaper rates to slightly below your link's physical synchronization ceiling—typically **85% to 92%** of your baseline bandwidth:

```uci
config queue 'eth1'
    option interface 'pppoe-wan'
    option enabled '1'
    option qdisc 'cake'
    option script 'piece_of_cake.qos'
    option download '90000'
    option upload '45000'
```

### Step 3: Link Layer Adaptation

Packet framing overhead (Ethernet preamble, inter-packet gap, ATM/VDSL cell padding) directly affects true wire bandwidth consumption. In OpenWRT's SQM settings:

- **Fiber / Direct Ethernet / Cable**: Select `Ethernet` with `18` bytes per-packet overhead.
- **VDSL / PPPoE**: Select `Ethernet` with `8` to `12` bytes per-packet overhead (depending on VLAN encapsulation).
- **ADSL**: Select `ATM` with `44` bytes per-packet overhead.

Apply the settings:

```bash
/etc/init.d/sqm restart
```

---

## Verification: Eliminating the Latency Spike

With CAKE actively policing `pppoe-wan`, we repeated the saturating transfer while pinging Google DNS:

```text
64 bytes from 8.8.8.8: seq=10 ttl=124 time=3.342 ms
64 bytes from 8.8.8.8: seq=11 ttl=124 time=3.411 ms
[ Saturating Transfer Initiated - 90 Mbps Load Applied ]
64 bytes from 8.8.8.8: seq=12 ttl=124 time=4.829 ms
64 bytes from 8.8.8.8: seq=13 ttl=124 time=6.120 ms
64 bytes from 8.8.8.8: seq=14 ttl=124 time=8.452 ms
64 bytes from 8.8.8.8: seq=15 ttl=124 time=7.218 ms
64 bytes from 8.8.8.8: seq=16 ttl=124 time=9.041 ms
64 bytes from 8.8.8.8: seq=17 ttl=124 time=6.932 ms
```

Under 100% continuous bandwidth saturation, ping times spiked to **no more than 9–11 milliseconds**. Interactive responsiveness remained pristine.

---

## Architectural Takeaways for Engineering Leaders

1. **Latency Is the Real Ceiling**: Bandwidth scales horizontally; speed-of-light propagation and queue delay do not. In real-time platforms, web APIs, and remote desktop environments, controlling queue latency produces significantly greater end-user perceived speed than raw megabits.
2. **The Throughput-Latency Trade-off**: Yielding 8–10% of raw bandwidth to seize control of the packet queue is the single highest-ROI trade-off available in network edge engineering.
3. **Hardware Sizing**: Because SQM performs per-packet queuing in software, it requires non-trivial CPU interrupts. High-bandwidth uplinks (500 Mbps to 1 Gbps) require modern multi-core ARM or x86 router hardware (such as x86 mini-PCs running OpenWRT on Linux kernel 6.x) to sustain CAKE at full line rate.

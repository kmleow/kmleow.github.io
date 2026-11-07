---
title: "Advanced Policy-Based Routing: Multi-Gateway Traffic Steering with iproute2, fwmark, and IPset"
description: "Architecting multi-tunnel WAN split routing using Linux kernel routing tables, connection packet marking, and dynamic DNS-driven IP sets."
pubDate: 2016-06-19
updatedDate: 2026-11-07
heroImage: "/images/heroes/policy-routing-openvpn.svg"
heroAlt: "Network topology diagram of policy routing with iproute2 and fwmark"
category: "Infrastructure & Protocols"
tags: ["Networking", "Routing", "Linux", "Security", "OpenVPN"]
legacyUrls:
  - "/2016/06/19/conditional-multiple-openvpn-routing-hostname-ip/"
---

In complex enterprise and edge network architectures, relying on a single monolithic default gateway is fundamentally limiting. Organisations frequently need to route specific subnets, sensitive enterprise services, or third-party cloud integrations through dedicated point-to-point tunnels while allowing latency-sensitive domestic traffic to egress directly through the physical WAN.

Classical routing operates strictly on destination IP lookups within the kernel's primary Forwarding Information Base (FIB table `main`). However, when routing decisions must account for **source IP, egress interface, destination port, or dynamic domain names with rotating Anycast IP pools**, we must transition to **Policy-Based Routing (PBR)**.

This guide demonstrates how to architect a deterministic multi-gateway policy routing engine in Linux (via OpenWRT and `mwan3`), orchestrating `iproute2` auxiliary routing tables, `netfilter` firewall marks (`fwmark`), and dynamic `ipset` DNS tagging.

---

## Architectural Topology

![Policy-Based Multi-Tunnel Split Routing Architecture](/images/diagrams/pbr-routing-topology.svg)

---

## Core Components of the Stack

To build dynamic policy routing without brittle static scripts, four subsystem capabilities must integrate:

1. **Secondary Routing Tables (`iproute2`)**: Decoupled routing tables containing their own distinct default routes.
2. **Routing Rules (`ip rule`)**: Kernel-level selector policies evaluating incoming packets against packet marks, source subnets, or interfaces to assign which FIB table resolves the route.
3. **Firewall Marking (`iptables -t mangle`)**: Tagging packets with hexadecimal bitmasks (`fwmark`) during ingress `PREROUTING`.
4. **Dynamic IP Sets (`ipset` + `dnsmasq-full`)**: Intercepting DNS lookups at the gateway resolver to automatically populate kernel hash tables with all resolved IP addresses belonging to target domain names.

---

## Step-by-Step Implementation

### 1. Provisioning Auxiliary Routing Tables

Define an auxiliary routing table identifier in `/etc/iproute2/rt_tables`:

```bash
echo "100 usvpn_table" >> /etc/iproute2/rt_tables
```

When your VPN interface (`tun0`) establishes connection, configure its default route within this designated table:

```bash
ip route add default dev tun0 table usvpn_table
```

### 2. Multi-WAN & Policy Orchestration via `mwan3`

In OpenWRT, `mwan3` abstracts kernel routing policies into clean declarative UCI declarations. 

In `/etc/config/mwan3`:

```uci
config interface 'wan'
    option enabled '1'
    list track_ip '8.8.8.8'
    list track_ip '1.1.1.1'
    option reliability '1'
    option count '1'
    option timeout '2'
    option interval '5'
    option down '3'
    option up '8'

config interface 'usvpn'
    option enabled '1'
    option family 'ipv4'
    list track_ip '199.85.126.10'
    option reliability '1'
    option count '1'
    option timeout '2'
    option interval '5'
    option down '3'
    option up '8'

config member 'wan_member'
    option interface 'wan'
    option metric '1'
    option weight '1'

config member 'usvpn_member'
    option interface 'usvpn'
    option metric '1'
    option weight '1'

config policy 'usvpn_only'
    list use_member 'usvpn_member'
    option last_resort 'unreachable'
```

> [!IMPORTANT]
> Note the `option last_resort 'unreachable'` directive. This acts as a strict **Kill Switch**. If the VPN tunnel collapses, traffic directed to this policy will be dropped by the kernel rather than silently leaking out to the unencrypted physical WAN.

---

## Policy Routing Strategies

### Strategy A: Enforcing Host-Level Tunnelling by Source IP

To pin an entire internal server or testing device (`192.168.1.150`) to the VPN tunnel:

```uci
config rule 'host_to_usvpn'
    option src_ip '192.168.1.150/32'
    option proto 'all'
    option sticky '0'
    option use_policy 'usvpn_only'
```

To reinforce this and prevent WAN leaks during interface reconfiguration, add a hard firewall rejection in `/etc/config/firewall`:

```uci
config rule
    option src 'lan'
    option dest 'wan'
    option name 'Deny-Host-WAN-Leak'
    option proto 'all'
    option src_ip '192.168.1.150/32'
    option target 'REJECT'
```

---

### Strategy B: Dynamic Domain Steering with IPset and DNS Interception

Hardcoding destination IP addresses for modern web services is unworkable because content delivery networks continuously rotate Anycast addresses. Instead, we instruct the local DNS daemon (`dnsmasq-full`) to automatically register lookup results into a kernel `ipset`.

#### 1. Configure DNSMASQ IPset Tagging

Ensure `dnsmasq-full` is installed:

```bash
opkg update
opkg install dnsmasq-full
```

In `/etc/dnsmasq.conf`:

```text
ipset=/services.example.com/usvpn_targets
```

#### 2. Prevent Anycast DNS Geographic Collisions

When resolving domains routed through a remote tunnel, local DNS servers frequently return CDN edge nodes physically closest to your WAN, which may reject or degrade VPN-routed sessions. Direct resolution of specific target domains through the remote DNS endpoint:

In `/etc/config/dhcp`:

```uci
config dnsmasq
    ...
    list server '/services.example.com/199.85.126.10'
    list server '8.8.8.8'
```

#### 3. Attach MWAN3 Rule to the IPset

In `/etc/config/mwan3`:

```uci
config rule 'route_ipset_targets'
    option proto 'all'
    option sticky '0'
    option ipset 'usvpn_targets'
    option use_policy 'usvpn_only'
```

Restart `dnsmasq` and `mwan3`:

```bash
/etc/init.d/dnsmasq restart
/usr/sbin/mwan3 restart
```

---

## Verification & Kernel Inspection

Verify that packets are receiving the correct `fwmark` and matching the routing rules:

```bash
# Inspect active IPset entries
ipset list usvpn_targets

# Inspect kernel routing policy database
ip rule show

# Output:
# 0:      from all lookup local
# 1001:   from all fwmark 0x100/0xff00 lookup usvpn_table
# 32766:  from all lookup main
# 32767:  from all lookup default

# Test route resolution for an intercepted target IP
ip route get 198.51.100.5 mark 0x100
```

---

## Architectural Takeaways

- **Decoupled Egress Architecture**: Policy-based routing cleanly separates transport topology from application logic. Edge machines require no client-side VPN software or credential distribution.
- **Fail-Closed Security**: By setting `last_resort 'unreachable'`, policy routing eliminates the risk of silent plain-text fallback when tunnels drop.
- **Dynamic Sets Over Static Subnets**: Combining resolver-driven `ipset` tagging with `fwmark` allows infrastructure teams to steer complex SaaS dependencies dynamically without maintaining fragile IP range whitelists.

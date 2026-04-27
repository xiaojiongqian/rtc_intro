import type { Slide } from "../types";

export const slides: Slide[] = [
  {
    id: 1,
    section: "基础与理论",
    title: "RTC 实时通信核心技术",
    subtitle: "从能连上，到稳定交付体验",
    durationMinutes: 3,
    keyPoints: [
      "理解 RTC 的系统闭环：采集、编码、传输、反馈、播放。",
      "建立协议栈、架构、性能、安全与产业趋势的统一视角。",
      "把抽象指标落到可观察、可解释、可调优的工程动作。",
    ],
    visual: {
      type: "learningMap",
      data: {
        anchors: [
          { label: "链路", detail: "端到端媒体路径", tone: "signal" },
          { label: "协议", detail: "WebRTC / RTP / ICE", tone: "protocol" },
          { label: "体验", detail: "低时延与稳定性", tone: "warning" },
          { label: "观测", detail: "Stats 驱动优化", tone: "accent" },
        ],
      },
    },
    notes:
      "开场重点是纠偏：RTC 不是浏览器 API 拼装，而是一套围绕体验目标运转的实时闭环系统。",
  },
  {
    id: 2,
    section: "基础与理论",
    title: "课堂节奏",
    subtitle: "先建模型，再看协议，最后用指标回到体验",
    durationMinutes: 4,
    keyPoints: [
      "理论部分先回答：什么是实时、延迟从哪里来、质量如何衡量。",
      "代码和实验不提前抢戏，先让学生拥有判断系统的语言。",
      "互动复盘围绕四个问题：通了没有、稳不稳、清不清、能不能扩。",
    ],
    visual: {
      type: "courseRhythm",
      data: {
        phases: [
          { label: "理论", minutes: 35, focus: "概念与指标", tone: "signal" },
          { label: "协议", minutes: 45, focus: "建连与媒体", tone: "protocol" },
          { label: "架构", minutes: 35, focus: "P2P / SFU / MCU", tone: "accent" },
          { label: "实验", minutes: 45, focus: "弱网与 getStats", tone: "warning" },
        ],
      },
    },
    notes:
      "本页帮助听众形成预期：基础理论不是背景知识，而是后续协议、架构和调优判断的尺度。",
  },
  {
    id: 3,
    section: "基础与理论",
    title: "RTC 是什么",
    subtitle: "低时延双向交互，而不是更快一点的直播",
    durationMinutes: 4,
    keyPoints: [
      "RTC 的核心是人在回路中：说话、听见、回应必须连续发生。",
      "真正难点不是“通了”，而是弱网下仍然稳、清、低时延。",
      "会议、教育、连麦、客服、协作与 AI 实时语音都共享同一组约束。",
    ],
    visual: {
      type: "rtcScope",
      data: {
        modes: [
          {
            label: "RTC",
            latency: "100ms–400ms 级",
            flow: "双向 / 多向",
            fit: "对话、协作、AI Agent",
            active: true,
          },
          {
            label: "直播",
            latency: "秒级可接受",
            flow: "一对多",
            fit: "观看、连麦、活动分发",
          },
          {
            label: "VOD",
            latency: "启动后可深缓冲",
            flow: "点播",
            fit: "课程回放、影视内容",
          },
        ],
      },
    },
    notes:
      "要强调 RTC 的产品语义：观众不是只在等待画面，而是在参与一段实时关系。缓冲越深，稳定性可能越高，但实时性会被消耗。",
  },
  {
    id: 4,
    section: "基础与理论",
    title: "端到端链路",
    subtitle: "每一段都会贡献时延，也都可能吞掉质量",
    durationMinutes: 5,
    keyPoints: [
      "采集、预处理、编码、发送、网络、缓冲、解码、渲染共同决定体验。",
      "统计与反馈不能只看网络层，媒体管线内部同样会制造问题。",
      "优化动作要落在链路节点上，而不是停留在“网络不好”的归因。",
    ],
    visual: {
      type: "signalChain",
      data: {
        nodes: [
          {
            label: "采集",
            detail: "摄像头、麦克风、系统音频进入媒体管线。",
            latency: "5–30ms",
            risk: "设备权限、采样率、系统负载",
          },
          {
            label: "预处理",
            detail: "AEC、降噪、增益控制、背景处理。",
            latency: "5–40ms",
            risk: "声音失真、音乐场景被误伤",
          },
          {
            label: "编码",
            detail: "把原始音视频压缩成可传输码流。",
            latency: "10–80ms",
            risk: "CPU、功耗、码率不足",
          },
          {
            label: "传输",
            detail: "RTP/RTCP/SRTP 在网络中携带媒体与反馈。",
            latency: "20–250ms",
            risk: "丢包、抖动、排队、TURN 中继",
          },
          {
            label: "缓冲",
            detail: "接收端用播放缓冲吸收网络波动。",
            latency: "20–150ms",
            risk: "太浅会卡，太深不实时",
          },
          {
            label: "播放",
            detail: "解码、同步、渲染到扬声器和屏幕。",
            latency: "10–60ms",
            risk: "AV 不同步、首帧慢",
          },
        ],
      },
    },
    notes:
      "这里可以让学生点击每个节点：每一段都有收益和代价。RTC 优化不是单点加速，而是总预算管理。",
  },
  {
    id: 5,
    section: "基础与理论",
    title: "时延模型",
    subtitle: "端到端时延是预算，不是一个孤立数字",
    durationMinutes: 5,
    keyPoints: [
      "端到端时延 = 采集 + 处理 + 编码 + 排队 + 网络 + 缓冲 + 解码 + 渲染。",
      "交互系统里，稳定低时延通常比峰值码率更重要。",
      "首帧时间和平均 RTT 是课堂里最容易建立直觉的两个指标。",
    ],
    visual: {
      type: "latencyBudget",
      data: {
        segments: [
          { label: "采集", min: 6, base: 18, max: 38, tone: "signal" },
          { label: "处理", min: 4, base: 22, max: 55, tone: "accent" },
          { label: "编码", min: 10, base: 38, max: 90, tone: "protocol" },
          { label: "排队", min: 3, base: 18, max: 95, tone: "warning" },
          { label: "网络", min: 20, base: 72, max: 260, tone: "warning" },
          { label: "缓冲", min: 15, base: 55, max: 170, tone: "accent" },
          { label: "播放", min: 8, base: 26, max: 65, tone: "signal" },
        ],
      },
    },
    notes:
      "本页的交互是调节网络压力，观察总时延如何被排队和缓冲放大。讲解时要指出：看见总时延后，还要知道哪一段在涨。",
  },
  {
    id: 6,
    section: "基础与理论",
    title: "抖动、同步与播放时钟",
    subtitle: "不是所有延迟都一样；波动会逼迫系统做选择",
    durationMinutes: 5,
    keyPoints: [
      "抖动是包到达间隔的波动，不等于平均延迟变大。",
      "播放时钟要把不稳定到达转换成尽量稳定的呈现。",
      "音视频同步关注的是同一时刻的声音和画面是否一起抵达感知。",
    ],
    visual: {
      type: "jitterSync",
      data: {
        arrivals: [0, 32, 55, 96, 124, 171, 200, 240],
        playout: [70, 103, 136, 169, 202, 235, 268, 301],
        syncPairs: [
          { audio: 74, video: 86 },
          { audio: 146, video: 132 },
          { audio: 221, video: 238 },
        ],
      },
    },
    notes:
      "这里可以切换抖动视图和同步视图：前者解释 jitter buffer，后者解释口型同步。重点是让学生理解缓冲不是坏事，而是用时间换连续性。",
  },
  {
    id: 7,
    section: "基础与理论",
    title: "QoS 与 QoE",
    subtitle: "链路指标说明条件，用户体验说明结果",
    durationMinutes: 4,
    keyPoints: [
      "QoS 关注网络和传输质量，QoE 关注用户是否觉得可用、清晰、自然。",
      "低丢包不一定体验好；深缓冲可能稳定，却牺牲实时对话感。",
      "工程目标是多指标平衡，而不是让某个指标孤立最优。",
    ],
    visual: {
      type: "qosQoeMatrix",
      data: {
        rows: [
          {
            metric: "RTT",
            qos: "往返路径时延",
            qoe: "对话是否像实时发生",
            tradeoff: "过高会打断轮流发言节奏",
          },
          {
            metric: "丢包",
            qos: "链路丢失比例",
            qoe: "声音断裂、画面马赛克",
            tradeoff: "重传能救质量，也会吃掉时间",
          },
          {
            metric: "缓冲",
            qos: "吸收到达波动",
            qoe: "连续播放与实时感之间取舍",
            tradeoff: "更深更稳，也更慢",
          },
          {
            metric: "首帧",
            qos: "建连和媒体路径启动",
            qoe: "加入房间是否顺滑",
            tradeoff: "慢启动会让用户怀疑系统坏了",
          },
        ],
      },
    },
    notes:
      "作为基础理论收束页：后续协议、架构、编解码、拥塞控制和监控都回到这个矩阵。不是为了指标而指标，而是为了体验解释力。",
  },
];

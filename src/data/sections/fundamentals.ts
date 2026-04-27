import type { Slide } from "../../types";

export const fundamentalsSlides: Slide[] = [
  {
    id: 6,
    section: "基础理论",
    title: "基础理论地图",
    subtitle: "从能连上，到稳定交付体验",
    durationMinutes: 3,
    keyPoints: [
      "RTC 是采集、编码、传输、反馈、播放共同组成的实时闭环；任何一环变慢，体验都会被重新塑形。",
      "WebRTC 只是浏览器侧能力入口，真正交付体验还要理解 RTP/RTCP、ICE、拥塞控制、Stats 与业务控制面。",
      "课堂目标不是记协议名，而是能解释“为什么通了还卡、为什么清晰但不实时、为什么 TURN 反而是保障”。",
    ],
    takeaway: "本课程把 RTC 看成一套持续自我修正的系统：媒体在跑，反馈也在跑。",
    visual: {
      type: "learningMap",
      data: {
        anchors: [
          { label: "链路", detail: "端到端媒体路径", depth: "从设备采集到扬声器/屏幕呈现，所有缓冲都是体验预算。", tone: "signal" },
          { label: "协议", detail: "WebRTC / RTP / ICE", depth: "API、媒体承载、穿透、安全和反馈分别解决不同层的问题。", tone: "protocol" },
          { label: "体验", detail: "低时延与稳定性", depth: "实时感、清晰度、连续性会互相拉扯，不能单指标最优。", tone: "warning" },
          { label: "观测", detail: "Stats 驱动优化", depth: "RTT、jitterBufferDelay、loss、首帧时间把感觉变成可调对象。", tone: "accent" },
        ],
      },
    },
    notes:
      "从这里正式进入基础理论。提醒学生：理论不是背景知识，而是后续调协议、选架构、做监控时的判断尺度。",
  },
  {
    id: 7,
    section: "基础理论",
    title: "端到端链路",
    subtitle: "每一段都会贡献时延，也都可能吞掉质量",
    durationMinutes: 5,
    keyPoints: [
      "采集、预处理、编码、发送排队、网络、抖动缓冲、解码和渲染都在消耗同一份端到端时延预算。",
      "RTCP 反馈、浏览器 getStats、服务端 SFU 指标与业务埋点必须拼在一起，才能定位是哪一段在退化。",
      "优化动作要落在链路节点上：降编码复杂度、减发送队列、调缓冲策略、改善路由，含义完全不同。",
    ],
    takeaway: "“网络不好”不是结论，只是调查入口；真正的问题必须落到链路节点和指标变化。",
    visual: {
      type: "signalChain",
      data: {
        nodes: [
          { label: "采集", detail: "摄像头、麦克风、系统音频进入媒体管线。", latency: "5–30ms", risk: "设备权限、采样率、系统负载", metric: "getUserMedia 成功率、采集帧率、音频电平" },
          { label: "预处理", detail: "AEC、降噪、增益控制、背景处理。", latency: "5–40ms", risk: "声音失真、音乐场景被误伤", metric: "concealedSamples、音频能量、CPU 占用" },
          { label: "编码", detail: "把原始音视频压缩成可传输码流。", latency: "10–80ms", risk: "CPU、功耗、码率不足", metric: "framesEncoded、QP、编码耗时、实际码率" },
          { label: "传输", detail: "RTP/RTCP/SRTP 在网络中携带媒体与反馈。", latency: "20–250ms", risk: "丢包、抖动、排队、TURN 中继", metric: "RTT、packetsLost、jitter、candidate-pair" },
          { label: "缓冲", detail: "接收端用播放缓冲吸收网络波动。", latency: "20–150ms", risk: "太浅会卡，太深不实时", metric: "jitterBufferDelay、emittedCount、freezeCount" },
          { label: "播放", detail: "解码、同步、渲染到扬声器和屏幕。", latency: "10–60ms", risk: "AV 不同步、首帧慢", metric: "estimatedPlayoutTimestamp、framesDecoded、首帧时间" },
        ],
      },
    },
    notes:
      "本页用上下键切换节点。让学生说出：如果这段变差，用户会怎么感知？监控里会看到什么？",
  },
  {
    id: 8,
    section: "课堂互动",
    title: "链路诊断：问题最可能在哪一段",
    subtitle: "把学生从“网络不好”带到“证据定位”",
    durationMinutes: 5,
    keyPoints: [
      "给学生一个现象：入会成功，但对方说话断续、画面偶尔冻结，聊天消息很快。",
      "请先选择最可能的链路段，再要求说出需要补充哪些 Stats 证据。",
      "按 Enter 揭示参考诊断；按上下方向切换不同候选答案。",
    ],
    takeaway: "互动目标：让学生用链路模型做定位，而不是凭直觉归因。",
    visual: {
      type: "studentPrompt",
      data: {
        question: "现象：聊天消息很快，但音频断续、视频冻结。最优先排查哪里？",
        instruction: "先让学生分组讨论 60 秒，再逐项揭示参考判断。",
        options: [
          {
            label: "A",
            answer: "只排查信令服务，因为入会流程可能有问题。",
            rationale: "优先级较低。信令已完成且数据消息很快，媒体链路或接收端处理更可疑。",
            tone: "protocol",
          },
          {
            label: "B",
            answer: "排查媒体传输、抖动缓冲和接收端解码。",
            rationale: "更合理。需要看 packetsLost、jitterBufferDelay、freezeCount、framesDecoded、CPU 等指标。",
            tone: "signal",
          },
          {
            label: "C",
            answer: "直接加大视频码率，让画面更清晰。",
            rationale: "可能反而恶化。冻结和断续说明实时链路已经吃紧，先定位瓶颈再提升质量。",
            tone: "warning",
          },
        ],
      },
    },
    notes:
      "这页穿插在端到端链路之后，目的是把链路图变成诊断方法。学生必须说出证据，而不只是选答案。",
  },
  {
    id: 9,
    section: "基础理论",
    title: "时延模型",
    subtitle: "端到端时延是预算，不是一个孤立数字",
    durationMinutes: 5,
    keyPoints: [
      "端到端时延不是单独的网络 RTT，而是采集、处理、编码、排队、网络、缓冲、解码、渲染的总和。",
      "排队和缓冲常常是隐藏放大器：网络轻微波动会被发送队列、jitter buffer 和关键帧请求继续放大。",
      "课堂先用首帧时间和平均 RTT 建直觉，再引入 jitterBufferDelay、实际码率和冻结率解释细节。",
    ],
    takeaway: "低时延优化不是把每段压到最低，而是避免某一段失控后拖垮整条链路。",
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
      "本页用上下键调节网络压力，观察总时延如何被排队和缓冲放大。",
  },
  {
    id: 10,
    section: "基础理论",
    title: "抖动、同步与播放时钟",
    subtitle: "不是所有延迟都一样；波动会逼迫系统做选择",
    durationMinutes: 5,
    keyPoints: [
      "抖动描述的是包到达间隔的波动：平均 RTT 可能不高，但到达节奏不稳仍会造成卡顿和缓冲增长。",
      "播放时钟的任务是把不规则到达转成稳定呈现，因此 jitter buffer 本质上是在用额外时延购买连续性。",
      "AV sync 不是简单同一包到达，而是音频、视频在接收端播放时间上的对齐，口型偏差会直接破坏可信感。",
    ],
    takeaway: "抖动让系统在“实时”和“连续”之间做选择；同步让多条媒体流在感知上重新合成一个现场。",
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
      "这里切换抖动视图和同步视图：前者解释 jitter buffer，后者解释口型同步。",
  },
  {
    id: 11,
    section: "课堂互动",
    title: "体验取舍：你会先牺牲什么",
    subtitle: "实时系统没有免费午餐，只有优先级",
    durationMinutes: 5,
    keyPoints: [
      "场景：学生在弱网下上互动课，老师声音断续，画面也不稳定，但课堂必须继续。",
      "请学生按角色选择：平台工程师会先保音频、保画面、保低延迟，还是保所有人同等质量？",
      "按 Enter 揭示参考答案；要求学生说出为什么这个选择适合在线教育。",
    ],
    takeaway: "互动目标：把 QoS/QoE 的概念提前落到产品取舍。",
    visual: {
      type: "studentPrompt",
      data: {
        question: "弱网互动课里，最优先保护哪项体验？",
        instruction: "先投票，再讨论：换成音乐课、远程手术、连麦直播，答案会不会变？",
        options: [
          {
            label: "A",
            answer: "优先保护音频连续和可懂度。",
            rationale: "通常正确。在线教育里听懂老师比看清每一帧更关键，可先降视频层、帧率或分辨率。",
            tone: "signal",
          },
          {
            label: "B",
            answer: "优先保护最高视频清晰度。",
            rationale: "不一定。清晰画面如果带来更深缓冲和音频断续，学习体验会下降。",
            tone: "warning",
          },
          {
            label: "C",
            answer: "让所有学生保持完全相同的媒体质量。",
            rationale: "不适合。RTC 往往需要按接收端网络和屏幕大小做差异化订阅与降级。",
            tone: "accent",
          },
        ],
      },
    },
    notes:
      "这页在 QoS/QoE 前，用一个产品取舍问题让学生先感受到指标之间的冲突。",
  },
  {
    id: 12,
    section: "基础理论",
    title: "QoS 与 QoE",
    subtitle: "链路指标说明条件，用户体验说明结果",
    durationMinutes: 4,
    keyPoints: [
      "QoS 是链路和传输条件：RTT、丢包、抖动、吞吐、candidate 类型；QoE 是用户最终感知：是否清楚、顺滑、自然。",
      "低丢包不保证体验好：编码过载、缓冲过深、首帧过慢、音画不同步都会让用户觉得系统不可用。",
      "成熟 RTC 系统会把建连成功率、首帧时间、冻结率、音频隐藏比例和 TURN 回退率一起纳入质量判断。",
    ],
    takeaway: "QoS 解释条件，QoE 验证结果；好的监控要能从结果倒推到条件。",
    visual: {
      type: "qosQoeMatrix",
      data: {
        rows: [
          {
            qosMetric: "RTT",
            qoeMetric: "交互自然度",
            qos: "往返路径时延，说明传输路径是否拖慢反馈闭环。",
            qoe: "用户是否觉得对话能自然接话、打断、回应，而不是总在等对方。",
            tradeoff: "QoE 可用主观评分/MOS、轮次间隔、端到端口到耳时延做综合判断。",
            qosSignal: "totalRoundTripTime / roundTripTimeMeasurements",
            qoeSignal: "MOS / 用户评分 + 端到端交互时延",
          },
          {
            qosMetric: "丢包",
            qoeMetric: "语音可懂度",
            qos: "链路丢失比例，说明媒体包是否完整到达。",
            qoe: "用户听到的是不是连续、清楚、可理解，是否出现断字、吞音、机械感。",
            tradeoff: "音频 QoE 更接近用户听感，可用隐藏样本比例和主观评分代理。",
            qosSignal: "packetsLost / (packetsLost + packetsReceived)",
            qoeSignal: "concealedSamples / totalSamplesReceived",
          },
          {
            qosMetric: "抖动缓冲",
            qoeMetric: "视频流畅度",
            qos: "吸收网络到达波动，说明接收端为了平滑播放付出了多少等待。",
            qoe: "用户看到的是不是顺滑，是否频繁冻结、掉帧、停顿后突然追帧。",
            tradeoff: "视频 QoE 不只看缓冲深度，更要看冻结次数、冻结总时长和帧率。",
            qosSignal: "jitterBufferDelay / jitterBufferEmittedCount",
            qoeSignal: "freezeCount + totalFreezesDuration + framesPerSecond",
          },
          {
            qosMetric: "建连路径",
            qoeMetric: "入会等待感",
            qos: "ICE/DTLS/媒体路径启动是否顺利，说明系统能否把媒体送到接收端。",
            qoe: "用户点击加入后多久看见/听见远端，是否怀疑房间卡住或失败。",
            tradeoff: "这是用户旅程指标，通常来自业务埋点与首个远端音视频帧时间。",
            qosSignal: "selectedCandidatePair + connectionState",
            qoeSignal: "firstRemoteFrameTs - joinClickedTs",
          },
        ],
      },
    },
    notes:
      "作为基础理论收束页：后续协议、架构、编解码、拥塞控制和监控都回到这个矩阵。",
  },
];

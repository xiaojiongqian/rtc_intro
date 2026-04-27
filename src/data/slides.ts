import type { Slide } from "../types";

export const slides: Slide[] = [
  {
    id: 1,
    section: "导言",
    title: "为什么今天还要学 RTC",
    subtitle: "实时通信不是“视频能播”，而是“人还在同一个现场”",
    durationMinutes: 3,
    keyPoints: [
      "RTC 的价值来自交互闭环：用户说话、听见、打断、回应，这些动作必须在短时间内连续发生。",
      "技术难点已经从“能否连上”转向“弱网、多人、跨区、端侧负载下如何稳定交付体验”。",
      "本课程先建立概念和体验指标，再进入协议、架构、编解码、传输优化与工程实验。",
    ],
    takeaway: "先把 RTC 看成“现场感系统”，再看它由哪些协议和指标支撑。",
    visual: {
      type: "learningMap",
      data: {
        anchors: [
          { label: "现场", detail: "人仍在同一交互窗口", depth: "对话轮转、打断、反馈必须自然发生。", tone: "signal" },
          { label: "闭环", detail: "媒体与反馈同时流动", depth: "RTP 传媒体，RTCP/Stats 帮系统持续修正。", tone: "protocol" },
          { label: "约束", detail: "时延、抖动、丢包、功耗", depth: "任何指标失控都会把体验推离实时。", tone: "warning" },
          { label: "体验", detail: "清楚、顺滑、自然、可信", depth: "最终要回到用户是否愿意继续对话。", tone: "accent" },
        ],
      },
    },
    notes:
      "开场不要急着讲 WebRTC API。先让学生明白：RTC 是一种交互体验约束，协议只是满足约束的工具集合。",
  },
  {
    id: 2,
    section: "导言",
    title: "RTC 的概念边界",
    subtitle: "低时延双向交互，而不是更快一点的直播",
    durationMinutes: 4,
    keyPoints: [
      "RTC 的核心是“人在回路中”：说话、听见、打断、回应都发生在很短的交互窗口内。",
      "直播可以用更深缓冲换稳定；RTC 深缓冲会直接损伤对话轮转、口型同步和临场感。",
      "VOD 允许预取和长缓冲；RTC 必须面对不可预测的实时输入、实时网络和实时反馈。",
    ],
    takeaway: "判断一个系统是不是 RTC，不看它用了什么 SDK，而看用户是否还在实时交互窗口里。",
    visual: {
      type: "rtcScope",
      data: {
        modes: [
          {
            label: "RTC",
            latency: "100ms–400ms 级",
            flow: "双向 / 多向",
            fit: "会议、连麦、协作、AI Agent",
            constraint: "必须保护轮流发言和即时反馈",
            active: true,
          },
          {
            label: "直播",
            latency: "秒级可接受",
            flow: "一对多",
            fit: "活动分发、观看、弱互动",
            constraint: "更重视规模、稳定分发和成本",
          },
          {
            label: "VOD",
            latency: "启动后可深缓冲",
            flow: "点播",
            fit: "课程回放、影视内容",
            constraint: "允许提前下载和长缓冲",
          },
        ],
      },
    },
    notes:
      "这里让学生用自己的应用经验比较：视频会议、直播课、录播课为什么不能用同一套体验标准评价。",
  },
  {
    id: 3,
    section: "导言",
    title: "RTC 的具体应用场景",
    subtitle: "同一条媒体链路，在不同产品里承受不同压力",
    durationMinutes: 5,
    keyPoints: [
      "会议和远程协作最怕对话延迟、回声和共享屏幕模糊；体验目标是自然沟通和任务完成。",
      "在线教育、连麦直播和客服更关注稳定入会、角色切换、弱网兜底和音频可懂度。",
      "AI 实时语音/视频把模型推理纳入时延预算，RTC 的链路不再只连接人，也连接实时智能体。",
    ],
    takeaway: "场景不同，优先级不同；RTC 选型永远要先问“谁在实时互动”。",
    visual: {
      type: "scenarioMap",
      data: {
        scenarios: [
          {
            label: "视频会议",
            setting: "多人发言 + 共享屏幕",
            media: "语音、摄像头、屏幕共享",
            constraint: "低延迟、回声控制、清晰共享屏",
            metric: "端到端时延、AV sync、冻结率",
            tone: "signal",
          },
          {
            label: "在线教育",
            setting: "教师主导 + 学生互动",
            media: "语音、板书、课件、连麦",
            constraint: "语音可懂度优先，弱网下不能掉课",
            metric: "首帧时间、concealment、重连率",
            tone: "protocol",
          },
          {
            label: "连麦直播",
            setting: "主播 + 嘉宾 + 大量观众",
            media: "RTC 连麦 + 直播分发",
            constraint: "连麦低延迟，观看侧可接受更深缓冲",
            metric: "上麦成功率、混流延迟、卡顿率",
            tone: "warning",
          },
          {
            label: "AI 实时语音",
            setting: "人和 Agent 轮流说话",
            media: "语音、字幕、模型响应",
            constraint: "模型推理也进入交互时延预算",
            metric: "turn-taking latency、打断响应、TTS 首音",
            tone: "accent",
          },
        ],
      },
    },
    notes:
      "本页用键盘下箭头切换场景。要求学生说出每个场景的第一体验目标，而不是先说技术方案。",
  },
  {
    id: 4,
    section: "课堂互动",
    title: "热身判断：哪个更像 RTC 问题",
    subtitle: "先让学生站队，再揭示背后的实时约束",
    durationMinutes: 5,
    keyPoints: [
      "请学生先独立判断：这些问题里，哪些主要是 RTC 问题，哪些更像点播/直播/业务系统问题。",
      "追问理由：你判断依据是时延、双向交互、媒体同步、网络穿透，还是用户旅程？",
      "按 Enter 揭示参考答案，按上下方向切换题目；鼓励学生给出反例。",
    ],
    takeaway: "互动目标：把“实时”从口号变成可判断的产品和工程边界。",
    visual: {
      type: "studentPrompt",
      data: {
        question: "下列现象里，哪个最典型地暴露 RTC 系统问题？",
        instruction: "先请学生举手选择，再按 Enter 揭示参考答案。",
        options: [
          {
            label: "A",
            answer: "两个人同时说话时总是互相打断，像隔着一拍在聊天。",
            rationale: "是。它直接指向交互时延、音频链路和回声/同步问题，是 RTC 的核心体验失败。",
            tone: "signal",
          },
          {
            label: "B",
            answer: "录播课第一次打开需要缓冲 3 秒，但播放后一直流畅。",
            rationale: "不典型。它更像 VOD 启播体验，允许用缓冲换稳定，不是实时双向交互。",
            tone: "protocol",
          },
          {
            label: "C",
            answer: "直播观众看到画面比主播现场晚 5 秒，但弹幕很多。",
            rationale: "要看互动要求。纯观看直播可接受秒级延迟；如果要实时连麦，就变成 RTC 问题。",
            tone: "warning",
          },
        ],
      },
    },
    notes:
      "这页不要直接给答案。先让学生做选择，然后追问“为什么”。让他们先使用刚建立的概念边界。",
  },
  {
    id: 5,
    section: "学习路径",
    title: "这门课怎么走",
    subtitle: "先建判断语言，再讲协议和代码",
    durationMinutes: 4,
    keyPoints: [
      "第一段讲基础理论：时延、抖动、同步、QoS/QoE 是后面所有工程决策的坐标系。",
      "第二段讲协议与架构：Offer/Answer、ICE、DTLS-SRTP、RTP/RTCP、P2P/SFU/MCU。",
      "第三段讲实验与观测：用 getStats 和弱网扰动把“用户觉得卡”翻译成可验证指标。",
    ],
    takeaway: "先有指标语言，后面看协议和代码才不会变成 API 逐行背诵。",
    visual: {
      type: "courseRhythm",
      data: {
        phases: [
          { label: "导言", minutes: 17, focus: "概念边界与场景", output: "能说清 RTC 和直播/VOD 的差异", tone: "accent" },
          { label: "理论", minutes: 32, focus: "时延、抖动、同步、体验", output: "能拆解一次通话的体验预算", tone: "signal" },
          { label: "协议", minutes: 45, focus: "建连、安全、媒体承载", output: "能解释 offer/answer 与媒体路径", tone: "protocol" },
          { label: "实验", minutes: 45, focus: "弱网与 getStats", output: "能把现象映射到可观测指标", tone: "warning" },
        ],
      },
    },
    notes:
      "这是课程地图。后续继续扩展协议、架构、编解码时，仍然沿用这条学习路径。",
  },
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
  {
    id: 13,
    section: "协议与建连",
    title: "RTC 协议栈总览",
    subtitle: "WebRTC 是一组协作规范，不是单一传输协议",
    durationMinutes: 5,
    keyPoints: [
      "应用信令负责房间、鉴权、角色、SDP/ICE 交换；它定义业务流程，但通常不承载音视频媒体。",
      "JSEP/SDP 描述能力与意图，ICE/STUN/TURN 找可达路径，DTLS 建安全上下文，SRTP/RTP/RTCP 承载媒体与反馈。",
      "建连成功只是开始：媒体包、质量反馈、拥塞控制、保活和重选会在整场通话中持续运行。",
    ],
    takeaway: "把协议按控制面、建连面、安全面、媒体面拆开，复杂度会立刻变得可解释。",
    visual: {
      type: "protocolStack",
      data: {
        layers: [
          {
            label: "应用信令",
            role: "房间、鉴权、角色、SDP 与 ICE candidate 透传。",
            plane: "控制面",
            evidence: "日志里看 join、publish、subscribe、offer/answer、candidate 交换是否完整。",
            tone: "accent",
          },
          {
            label: "JSEP / SDP",
            role: "用浏览器状态机和会话描述协商媒体能力与方向。",
            plane: "协商面",
            evidence: "检查 m-line、codec、方向、ICE ufrag/pwd、fingerprint 是否匹配预期。",
            tone: "protocol",
          },
          {
            label: "ICE / STUN / TURN",
            role: "收集候选、做连通性检查、选择可用候选对并保活。",
            plane: "建连面",
            evidence: "看 candidate 类型、selected candidate pair、ICE state 和 TURN 回退比例。",
            tone: "warning",
          },
          {
            label: "DTLS",
            role: "完成端到端安全握手，验证 fingerprint 并导出 SRTP 密钥。",
            plane: "安全面",
            evidence: "关注 DTLS state、证书指纹、握手耗时和失败原因。",
            tone: "signal",
          },
          {
            label: "RTP / RTCP / SRTP",
            role: "RTP 跑媒体，RTCP 跑反馈和同步，SRTP 提供加密与认证。",
            plane: "媒体面",
            evidence: "用 RTT、loss、jitter、NACK、PLI、jitterBufferDelay 定位体验退化。",
            tone: "protocol",
          },
          {
            label: "SCTP / DataChannel",
            role: "在同一 PeerConnection 下承载低时延数据、控制和状态同步。",
            plane: "数据面",
            evidence: "关注 ordered/reliable 配置、bufferedAmount 和消息到达时序。",
            tone: "accent",
          },
        ],
      },
    },
    notes:
      "本页互动：让学生用上下键逐层标注哪些属于控制面、建连面、媒体面。强调 WebRTC 不是一条线，而是一组协作协议。",
  },
  {
    id: 14,
    section: "协议与建连",
    title: "RTP、RTCP 与 SRTP",
    subtitle: "媒体、反馈和安全封装分别解决不同问题",
    durationMinutes: 6,
    keyPoints: [
      "RTP 负责把音视频切成实时媒体包，并带上序号、时间戳、Payload Type 等接收端重组所需的信息。",
      "RTCP 是质量反馈与同步通道：接收报告、发送报告、NACK、PLI/FIR、RTT 和跨媒体同步都依赖它。",
      "SRTP 不改变“媒体怎么排队和反馈”的语义，而是在 RTP/RTCP 外提供机密性、认证和重放保护。",
    ],
    takeaway: "看冻结问题时，RTP 说明媒体包怎么到，RTCP 说明链路怎么反馈，SRTP 说明这些包是否被安全保护。",
    visual: {
      type: "protocolFlow",
      data: {
        lanes: [
          {
            label: "RTP",
            direction: "Sender → Receiver",
            payload: "音视频包、序号、时间戳、SSRC、Payload Type，支撑接收端排序、播放时钟和丢包判断。",
            signal: "媒体承载",
            evidence: "packetsSent / packetsReceived / framesDecoded / jitter",
            tone: "protocol",
          },
          {
            label: "RTCP",
            direction: "双向反馈",
            payload: "Receiver Report、Sender Report、NACK、PLI/FIR、RTT、同步信息，让发送端和接收端持续修正。",
            signal: "质量反馈",
            evidence: "roundTripTime / nackCount / pliCount / fractionLost",
            tone: "warning",
          },
          {
            label: "SRTP",
            direction: "覆盖 RTP/RTCP",
            payload: "对媒体和反馈包做加密、认证和重放保护，密钥通常由 DTLS 握手导出。",
            signal: "安全封装",
            evidence: "DTLS state / selected cipher / 解密失败计数",
            tone: "signal",
          },
        ],
      },
    },
    notes:
      "本页互动：给出“画面冻结但音频还在”的现象，让学生说 RTP/RTCP 各能提供什么证据。答案应落到包、反馈和缓冲指标。",
  },
  {
    id: 15,
    section: "协议与建连",
    title: "WebRTC API 与 JSEP",
    subtitle: "JavaScript 控制信令状态机，浏览器负责媒体与传输细节",
    durationMinutes: 6,
    keyPoints: [
      "`RTCPeerConnection` 是浏览器侧核心对象，但业务仍要自己决定何时创建 offer、如何发送、如何处理远端描述。",
      "JSEP 的关键思想是把信令协议留给应用，把 offer/answer 状态机暴露给 JavaScript 控制。",
      "最小主线是创建本地描述、发送给对端、设置远端描述、生成 answer，并持续交换 ICE candidates。",
    ],
    takeaway: "Offer/Answer 不是“发一段 SDP”这么简单，而是双方状态机逐步对齐媒体能力与路径信息。",
    visual: {
      type: "offerAnswer",
      data: {
        steps: [
          {
            actor: "Peer A",
            action: "createOffer",
            detail: "生成本端媒体能力、收发方向、ICE 参数和 DTLS fingerprint。",
            state: "准备进入本地 offer 状态",
            tone: "protocol",
          },
          {
            actor: "Peer A",
            action: "setLocalDescription",
            detail: "把 offer 绑定到本地 PeerConnection，启动本端协商状态。",
            state: "have-local-offer",
            tone: "signal",
          },
          {
            actor: "Signaling",
            action: "send offer",
            detail: "业务信令只负责可靠传递描述和上下文，不负责转发媒体包。",
            state: "应用自定义协议",
            tone: "accent",
          },
          {
            actor: "Peer B",
            action: "setRemoteDescription",
            detail: "接受远端能力、媒体意图和安全指纹，准备生成兼容 answer。",
            state: "have-remote-offer",
            tone: "warning",
          },
          {
            actor: "Peer B",
            action: "createAnswer",
            detail: "选择可兼容的编码、方向与传输参数，并生成应答描述。",
            state: "回到 stable 的前一步",
            tone: "protocol",
          },
          {
            actor: "Both",
            action: "exchange candidates",
            detail: "Trickle ICE 持续补充候选路径，直到选出可用 candidate pair。",
            state: "ICE checking / connected",
            tone: "signal",
          },
        ],
      },
    },
    notes:
      "本页互动：让学生先口头排序 createOffer、setLocalDescription、send offer、setRemoteDescription，再用下键逐步确认。",
  },
  {
    id: 16,
    section: "协议与建连",
    title: "SIP、SDP 与信令边界",
    subtitle: "信令负责让双方达成共识，不等于媒体路径本身",
    durationMinutes: 5,
    keyPoints: [
      "SIP 是传统会话信令协议；WebRTC 不强制使用 SIP，WebSocket/HTTP/自定义信令都可以承载 offer/answer。",
      "SDP 是会话描述格式，负责表达媒体能力、编解码、方向、安全指纹和 ICE 参数，但不规定业务房间语义。",
      "已建立媒体是否能在信令故障后继续，取决于媒体路径、ICE/DTLS 状态和业务是否还需要控制面续命。",
    ],
    takeaway: "信令服务把双方带到同一个协商状态；真正的媒体通常沿另一条路径持续流动。",
    visual: {
      type: "signalingBoundary",
      data: {
        zones: [
          {
            label: "业务信令",
            owner: "应用自定义",
            examples: "房间、鉴权、角色、邀请、聊天、SDP 与 ICE candidate 透传。",
            boundary: "它定义产品流程，但不是 WebRTC 规范强制的一种协议。",
            tone: "accent",
          },
          {
            label: "SDP",
            owner: "会话描述",
            examples: "m-line、codec、方向、SSRC、fingerprint、ICE ufrag/pwd。",
            boundary: "它描述能力和意图，不负责用户身份、付费、房间权限。",
            tone: "protocol",
          },
          {
            label: "SIP / 网关",
            owner: "可选互通层",
            examples: "企业语音、PSTN、传统会议系统和 WebRTC 房间互通。",
            boundary: "需要做信令和媒体能力转换，但浏览器侧 WebRTC 不要求必须用 SIP。",
            tone: "warning",
          },
          {
            label: "媒体路径",
            owner: "传输与媒体面",
            examples: "DTLS-SRTP、RTP、RTCP、candidate pair、jitter buffer。",
            boundary: "媒体路径不应该依赖业务信令服务来转发每一个音视频包。",
            tone: "signal",
          },
        ],
      },
    },
    notes:
      "本页互动：提问“信令服务崩溃后，已建立的通话一定会断吗？”引导学生分别讨论媒体路径、保活、重协商和业务控制面的差异。",
  },
  {
    id: 17,
    section: "协议与建连",
    title: "ICE、STUN 与 TURN",
    subtitle: "建连的本质是找到双方都能到达的路径",
    durationMinutes: 6,
    keyPoints: [
      "ICE 会收集 host、srflx、relay 等 candidate，按优先级做连通性检查，最终选出一对可用路径。",
      "STUN 帮端侧发现公网映射地址并做保活；它适合很多 NAT 场景，但不是所有企业网和对称 NAT 都能直连。",
      "TURN 是兜底中继：它增加带宽成本和时延，但能显著提高入会成功率，不应简单视为“坏路径”。",
    ],
    takeaway: "TURN 使用率上升不一定是坏事；它可能是在复杂网络里把失败变成可用。",
    visual: {
      type: "icePath",
      data: {
        paths: [
          {
            label: "Host",
            diagram: "host",
            route: "本机或局域网候选直接连通",
            cost: "最低时延",
            risk: "跨 NAT、跨企业网时经常不可达。",
            mediaFlow: "媒体流：Peer A 与 Peer B 在局域网/本机候选上直接互通。",
            probeFlow: "没有 STUN/TURN 参与媒体路径，适合本地可达或同网段场景。",
            tone: "signal",
          },
          {
            label: "STUN / srflx",
            diagram: "stun",
            route: "发现公网映射地址后尝试直连",
            cost: "低成本",
            risk: "对称 NAT、UDP 受限或防火墙策略可能失败。",
            mediaFlow: "媒体流：STUN 帮忙发现地址后，SRTP 媒体仍然 Peer-to-Peer 直达。",
            probeFlow: "STUN 流量用于 Binding/连通性检查；STUN Server 不转发音视频包。",
            tone: "protocol",
          },
          {
            label: "TURN / relay",
            diagram: "turn",
            route: "通过中继服务器转发媒体",
            cost: "成本更高",
            risk: "延迟和带宽成本上升，但通常能换来连通性保障。",
            mediaFlow: "媒体流：Peer A 先发给 TURN Relay，再由 TURN Relay 转发给 Peer B。",
            probeFlow: "TURN 是实际媒体中继，服务器会承载双向 RTP/SRTP 带宽和转发延迟。",
            tone: "warning",
          },
        ],
        checks: ["收集 candidate", "连通性检查", "候选对排序", "选中路径", "保活/重选"],
      },
    },
    notes:
      "本页互动：让学生投票 TURN 使用率升高是否一定坏。引导他们区分成本指标、质量指标和成功率指标。",
  },
  {
    id: 18,
    section: "课堂互动",
    title: "建连失败排查",
    subtitle: "从“connecting”倒推证据链，而不是盲目重试",
    durationMinutes: 7,
    keyPoints: [
      "场景：校园网能打开网页，但视频会议一直停在 connecting，没有远端音视频首帧。",
      "排查顺序按阶段推进：先确认本地采集与信令完成，再看 ICE 选路、DTLS 握手、最后才看媒体首帧。",
      "每个阶段都要求说出“看到什么证据、推断什么原因、下一步做什么”，不要只说网络不好。",
    ],
    takeaway: "建连排查要按阶段切开：信令是否完成、ICE 是否选路、DTLS 是否握手、媒体是否首帧。",
    visual: {
      type: "connectionTroubleshooting",
      data: {
        incident: "学生在校园网能打开网页，但视频会议一直 connecting，看不到远端首帧。",
        stages: [
          {
            label: "本地采集",
            question: "本端是否真的拿到了可用音视频轨？",
            evidence: [
              "getUserMedia 是否返回 NotAllowedError / NotFoundError / NotReadableError。",
              "本地预览是否有画面，音频电平是否变化，track.readyState 是否 live。",
              "系统权限、浏览器权限、摄像头是否被其他软件占用。",
            ],
            nextAction: "若本地轨都没有，不进入 ICE 深查；先恢复权限、设备和 HTTPS 环境。",
            tone: "accent",
            examples: [
              {
                symptom: "点击入会后没有本地预览，仍停在 connecting。",
                clue: "Console 出现 NotAllowedError，浏览器地址栏摄像头图标被禁用。",
                likelyCause: "浏览器站点权限被拒绝，应用拿不到本地媒体轨。",
                action: "重新授权站点权限，刷新后确认本地 preview 和 track.readyState。",
              },
              {
                symptom: "摄像头灯不亮，麦克风也没有电平。",
                clue: "getUserMedia 报 NotReadableError，系统设置里浏览器没有麦克风权限。",
                likelyCause: "操作系统权限或设备占用问题，不是 WebRTC 建连失败。",
                action: "打开系统隐私权限，关闭占用摄像头的软件，再重新入会。",
              },
            ],
          },
          {
            label: "信令 / SDP",
            question: "Offer/Answer 和候选是否完整到达双方？",
            evidence: [
              "业务日志里 offer、answer、candidate 是否都有 request id 和房间上下文。",
              "signalingState 是否卡在 have-local-offer / have-remote-offer。",
              "SDP 的 m-line、mid、ufrag/pwd、fingerprint 是否被网关或后端改坏。",
            ],
            nextAction: "若信令不完整，先修业务传递链路；媒体路径尚未开始，调 TURN 没意义。",
            tone: "protocol",
            examples: [
              {
                symptom: "A 端发起后一直 waiting，B 端没有任何远端流事件。",
                clue: "A 有 createOffer 和 setLocalDescription，B 端日志没有收到 offer。",
                likelyCause: "WebSocket 房间路由或鉴权失败，offer 没到对端。",
                action: "按 roomId / userId / requestId 串起信令日志，确认消息是否被投递。",
              },
              {
                symptom: "双方都收到 SDP，但 ICE 一直没有候选。",
                clue: "SDP 中 ice-ufrag / ice-pwd 缺失，m-line 顺序被服务端模板替换。",
                likelyCause: "后端错误拼接或清洗 SDP，破坏了 JSEP 生成的描述。",
                action: "禁止手写重排 SDP；只做必要字段审计，保留浏览器生成结构。",
              },
            ],
          },
          {
            label: "ICE 选路",
            question: "有没有选出可用 candidate pair？",
            evidence: [
              "iceConnectionState 是否停在 checking / failed。",
              "selectedCandidatePair 是否为空，候选类型是 host、srflx 还是 relay。",
              "STUN/TURN UDP/TCP/TLS 端口是否能从当前网络访问。",
            ],
            nextAction: "若没有候选对，重点查 UDP 限制、防火墙、TURN 账号、地域和端口策略。",
            tone: "signal",
            examples: [
              {
                symptom: "校园网白天可以入会，晚上宿舍网一直 checking。",
                clue: "host 和 srflx 都有，selectedCandidatePair 为空，TURN 也没有 relay candidate。",
                likelyCause: "校园网限制 UDP，且 TURN UDP 端口不可达或凭证失败。",
                action: "补 TURN/TCP 或 TURN/TLS 443 兜底，检查 coturn realm、用户名和过期时间。",
              },
              {
                symptom: "办公室网络只能文字聊天，音视频进不来。",
                clue: "信令 WebSocket 正常，ICE failed，抓包看到 STUN Binding 无响应。",
                likelyCause: "企业防火墙允许 HTTPS，但阻断 UDP/STUN。",
                action: "用 Trickle ICE 或连通性脚本验证 STUN/TURN，给企业网配置 relay fallback。",
              },
            ],
          },
          {
            label: "DTLS 安全",
            question: "安全握手是否完成，fingerprint 是否匹配？",
            evidence: [
              "connectionState 是否卡在 connecting，dtlsTransport.state 是否 failed。",
              "SDP fingerprint 是否被代理、SIP 网关或后端重写。",
              "证书算法、证书生命周期、时钟偏差是否异常。",
            ],
            nextAction: "若 ICE connected 但 DTLS failed，把注意力从网络转到安全握手和 SDP 指纹。",
            tone: "warning",
            examples: [
              {
                symptom: "ICE 显示 connected，但页面仍无媒体，几秒后连接失败。",
                clue: "webrtc-internals 里 DTLS state 从 connecting 到 failed。",
                likelyCause: "fingerprint 与实际 DTLS 证书不匹配，可能被信令网关改写。",
                action: "比对本端 localDescription、远端 remoteDescription 和网关转发内容。",
              },
              {
                symptom: "部分老设备能看到对方，部分浏览器一直失败。",
                clue: "DTLS 握手日志显示 cipher / signature algorithm 不兼容。",
                likelyCause: "老旧 WebView 或网关组件支持的 DTLS 能力不足。",
                action: "列出浏览器版本矩阵，升级内核或调整网关兼容策略。",
              },
            ],
          },
          {
            label: "媒体首帧",
            question: "连接已建好，媒体包是否真的开始到达并解码？",
            evidence: [
              "connectionState connected 后，packetsReceived、bytesReceived 是否增长。",
              "framesDecoded、audioLevel、firstRemoteFrameTs 是否出现。",
              "远端是否 actually addTrack / replaceTrack，SFU 是否已转发订阅流。",
            ],
            nextAction: "若首帧缺失，转向发布订阅、SFU 转发、编码器和接收端解码链路。",
            tone: "accent",
            examples: [
              {
                symptom: "状态已 connected，但远端黑屏，音频也没有声音。",
                clue: "selectedCandidatePair 有值，bytesReceived 为 0。",
                likelyCause: "媒体发布或 SFU 订阅没有真正开始，不是 ICE 问题。",
                action: "检查 publish/subscribe 信令、SFU 转发日志、sender 是否 addTrack。",
              },
              {
                symptom: "bytesReceived 增长，但画面仍不出现。",
                clue: "packetsReceived 增长，framesDecoded 为 0，PLI 计数升高。",
                likelyCause: "缺关键帧、编码参数不兼容或解码器初始化失败。",
                action: "请求关键帧，检查 codec/PT/RTX 映射，查看浏览器解码错误。",
              },
            ],
          },
        ],
      },
    },
    notes:
      "这页是协议建连单元的课堂练习。建议让学生按阶段给出证据链：本地采集、信令/SDP、ICE、DTLS、媒体首帧。上下键切换阶段，Enter 切换该阶段案例。",
  },
  {
    id: 19,
    section: "协议与建连",
    title: "DTLS、SCTP 与 DataChannel",
    subtitle: "从信令交换指纹，到 DTLS 导出 SRTP 密钥",
    durationMinutes: 6,
    keyPoints: [
      "信令阶段先交换 SDP fingerprint；DTLS 握手时用实际证书与 fingerprint 做绑定，防止媒体路径被替换。",
      "DTLS 握手完成后导出 SRTP keying material，音视频 RTP/RTCP 随后才以 SRTP/SRTCP 形式加密传输。",
      "DataChannel 基于 SCTP，可按 ordered/reliable 配置承载课堂互动、白板操作、字幕片段或实时控制消息。",
    ],
    takeaway: "信令交换“应当是谁”，DTLS 验证“实际是谁”，SRTP 才开始承载加密媒体。",
    visual: {
      type: "secureChannel",
      data: {
        stages: [
          {
            label: "信令交换指纹",
            detail: "Offer/Answer 通过业务信令交换 SDP fingerprint、ICE 参数和媒体意图；fingerprint 不是密钥，而是后续验证 DTLS 证书的锚点。",
            output: "SDP fingerprint",
            tone: "signal",
          },
          {
            label: "DTLS 握手验证",
            detail: "双方在选中的 ICE candidate pair 上进行 DTLS 握手，交换证书，并把证书指纹与 SDP 中收到的 fingerprint 对比。",
            output: "身份验证完成",
            tone: "protocol",
          },
          {
            label: "导出 SRTP 密钥",
            detail: "DTLS 握手成功后，双方从同一个 DTLS 会话导出 SRTP keying material，用于 RTP/RTCP 的加密、认证和重放保护。",
            output: "SRTP/SRTCP keys",
            tone: "warning",
          },
          {
            label: "SRTP 媒体启动",
            detail: "音视频 RTP/RTCP 包开始以 SRTP/SRTCP 形式传输；如果 DTLS 或密钥导出失败，媒体不应被解密播放。",
            output: "安全媒体面",
            tone: "signal",
          },
          {
            label: "SCTP / DataChannel",
            detail: "DataChannel 走 SCTP over DTLS，可选择可靠、有序或更轻的实时配置，与媒体共享 PeerConnection 的安全上下文。",
            output: "互动数据面",
            tone: "accent",
          },
        ],
        sequence: [
          {
            from: "peerA",
            to: "signaling",
            label: "Offer SDP",
            detail: "携带 fingerprint、ICE ufrag/pwd、媒体方向和编解码能力。",
            stage: 0,
            tone: "signal",
          },
          {
            from: "signaling",
            to: "peerB",
            label: "转发 Offer",
            detail: "业务信令只转发描述；不生成 DTLS 密钥，也不承载媒体包。",
            stage: 0,
            tone: "signal",
          },
          {
            from: "peerB",
            to: "signaling",
            label: "Answer SDP",
            detail: "返回 B 的 fingerprint、ICE 参数和最终协商的媒体能力。",
            stage: 0,
            tone: "signal",
          },
          {
            from: "peerA",
            to: "peerB",
            label: "DTLS ClientHello",
            detail: "在选中的 ICE 路径上开始 DTLS 握手，交换实际证书。",
            stage: 1,
            tone: "protocol",
          },
          {
            from: "peerB",
            to: "peerA",
            label: "DTLS Certificate",
            detail: "双方把证书 fingerprint 与 SDP 中收到的值做匹配验证。",
            stage: 1,
            tone: "protocol",
          },
          {
            from: "peerA",
            to: "peerB",
            label: "Export SRTP keys",
            detail: "双方本地从 DTLS 会话导出一致的 SRTP/SRTCP 密钥材料。",
            stage: 2,
            tone: "warning",
          },
          {
            from: "peerA",
            to: "media",
            label: "SRTP RTP/RTCP",
            detail: "媒体和反馈包进入 SRTP/SRTCP，获得加密、认证和重放保护。",
            stage: 3,
            tone: "signal",
          },
          {
            from: "media",
            to: "peerB",
            label: "解密播放",
            detail: "接收端使用导出的密钥验证并解密媒体，再进入 jitter buffer 和解码播放。",
            stage: 3,
            tone: "signal",
          },
          {
            from: "peerA",
            to: "peerB",
            label: "SCTP over DTLS",
            detail: "DataChannel 数据复用安全上下文，用于控制、文本、状态同步等低时延消息。",
            stage: 4,
            tone: "accent",
          },
        ],
      },
    },
    notes:
      "本页互动：上下键切换阶段。每切一段，右侧序列图同步高亮对应消息线。强调 fingerprint 是信令里交换的身份锚点，SRTP 密钥不是通过信令传输，而是由 DTLS 导出。",
  },
  {
    id: 20,
    section: "架构部分",
    title: "P2P Mesh 架构",
    subtitle: "结构最直接，但多方时每个客户端都变成小型媒体服务器",
    durationMinutes: 5,
    keyPoints: [
      "Mesh 中每个参与者都直接向其他人发送媒体；1 对 1 很自然，少量节点也容易理解和实现。",
      "人数增长时，上行路数、编码实例、带宽和端侧功耗快速放大；5 人房间里每端要发 4 路，全房间 20 个媒体方向。",
      "Mesh 难统一做录制、审计、转写、质量观测和服务端策略控制，因此通常不适合规模化多人会议。",
    ],
    takeaway: "Mesh 的问题不是“连不上”，而是人数一多后客户端上行和治理能力失控。",
    visual: {
      type: "meshArchitecture",
      data: {
        roomSizes: [
          {
            participants: 2,
            fit: "1 对 1",
            encoding: "1 路",
            pain: "适合简单通话：媒体路径短，服务端只需信令和少量辅助能力。",
            tone: "signal",
          },
          {
            participants: 3,
            fit: "小组讨论",
            encoding: "2 路",
            pain: "开始出现重复上行：每个端都要同时给另外两人发流，端侧负载开始显性化。",
            tone: "protocol",
          },
          {
            participants: 5,
            fit: "压力演示",
            encoding: "4 路",
            pain: "5 人时每端发 4 路，全房间 20 个方向；移动端、弱网和电量会很快成为瓶颈。",
            tone: "warning",
          },
        ],
      },
    },
    notes:
      "本页互动：让学生计算 5 人 mesh 每个客户端需要发送几路上行，再追问如果每路 720p 会发生什么。",
  },
  {
    id: 21,
    section: "架构部分",
    title: "SFU 架构",
    subtitle: "发送端上传一份或少量分层流，服务端按接收端条件选择转发",
    durationMinutes: 6,
    keyPoints: [
      "SFU 的核心是选择性转发：不做媒体内容解码、混流和重新编码，只按订阅关系转发 RTP/SRTP 包。",
      "接收端按网络、屏幕、布局和活跃说话人订阅不同质量层；这就是多方会议主流选择的核心原因。",
      "SFU 带来服务端观测、录制旁路、转写接入和策略控制能力，但也引入转发成本、级联和跨区路由问题。",
    ],
    takeaway: "SFU 的关键词是“透传 + 选择”：媒体仍是编码后的 RTP/SRTP 包，服务端只决定转给谁、转哪一层。",
    visual: {
      type: "sfuArchitecture",
      data: {
        uplink: {
          label: "1x simulcast uplink",
          detail: "发送端上传高/中/低层编码包，SFU 不解码重编，只按需转发。",
        },
        layers: [
          { label: "High", bitrate: "1280x720 / 1.5Mbps", fit: "主讲人、桌面大画面", tone: "signal" },
          { label: "Mid", bitrate: "640x360 / 600kbps", fit: "普通宫格、平板", tone: "protocol" },
          { label: "Low", bitrate: "180p / 150kbps", fit: "弱网、缩略图", tone: "warning" },
        ],
        receivers: [
          {
            label: "教师端",
            network: "有线网络 + 大屏",
            subscription: "High + audio",
            reason: "教师需要看清主讲或学生展示，SFU 直接把 High 层编码包转发给它。",
            tone: "signal",
          },
          {
            label: "学生 A",
            network: "普通 Wi-Fi",
            subscription: "Mid + audio",
            reason: "普通宫格场景不需要最高分辨率，SFU 选择 Mid 层透传，减少下行和解码压力。",
            tone: "protocol",
          },
          {
            label: "学生 B",
            network: "移动弱网",
            subscription: "Low + audio first",
            reason: "弱网下优先保护音频和连续性，SFU 转发 Low 层而不是替它重新编码一路新流。",
            tone: "warning",
          },
        ],
      },
    },
    notes:
      "本页互动：让学生解释为什么 SFU 不是简单“转发所有流”。用上下键切接收端，观察订阅层不同。",
  },
  {
    id: 22,
    section: "架构部分",
    title: "SFU vs MCU",
    subtitle: "都是中心化媒体拓扑，差别在服务器内部如何生成按需下行",
    durationMinutes: 6,
    keyPoints: [
      "SFU 和 MCU 的外部媒体拓扑相似：多路发送端上行到中心媒体服务器，再由服务器给多个接收端下行。",
      "SFU 依赖 SVC/Simulcast 的多质量编码结果，按接收端网络和布局选择性转发已有编码层。",
      "MCU 则把输入暴力解码成媒体帧，混音/混画/布局后再重新编码，才能生成每个接收端需要的输出。",
    ],
    takeaway: "拓扑看起来都像“中心服务器”，但 SFU 是选择已有编码层，MCU 是重新生产媒体流。",
    visual: {
      type: "mediaTopologyComparison",
      data: {
        modes: [
          {
            label: "SFU",
            server: "SFU",
            headline: "选择性转发已有编码层",
            inputLabel: "SVC L0/L1/L2",
            serverSteps: ["读 RTP/层级信息", "选择订阅层", "Forward packet"],
            outputs: [
              { label: "R1", stream: "L2 高清" },
              { label: "R2", stream: "L1 中清" },
              { label: "R3", stream: "L0 音频优先" },
            ],
            summary: "服务器不解码媒体内容，不重新生成画面，只把已有编码层按需转发。",
            tradeoff: "低处理时延和算力成本；输出形态受发送端编码层设计约束。",
            tone: "signal",
          },
          {
            label: "MCU",
            server: "MCU",
            headline: "解码后重新生产输出流",
            inputLabel: "encoded stream",
            serverSteps: ["Decode all inputs", "Mix / Layout", "Encode outputs"],
            outputs: [
              { label: "R1", stream: "教师大图布局" },
              { label: "R2", stream: "低码率混流" },
              { label: "R3", stream: "录制合成流" },
            ],
            summary: "服务器把媒体包还原成音视频帧，再混合、布局、重新编码成按需输出。",
            tradeoff: "输出形态自由、弱终端友好；服务器算力、时延和画质损失成本更高。",
            tone: "warning",
          },
        ],
      },
    },
    notes:
      "本页互动：先让学生观察两行拓扑是否相似，再追问服务器内部处理有什么不同。收束到：SFU 依赖 SVC/Simulcast 选择性转发，MCU 通过解码、混流和重新编码实现按需传输。",
  },
  {
    id: 23,
    section: "课堂互动",
    title: "架构选型辩论",
    subtitle: "200 人在线课，10 人随时上麦，还要录制和字幕",
    durationMinutes: 7,
    keyPoints: [
      "请学生分组站队：P2P、SFU、MCU、边缘 SFU + 中心媒体服务，各自必须给出成本、时延、录制、弱网理由。",
      "不能只说“SFU 是主流”；要说明上麦人数、观看人数、录制字幕、弱网降级和服务端观测如何被架构承接。",
      "按 Enter 切换评价维度，按上下方向切换候选架构，观察不同方案的短板在哪里。",
    ],
    takeaway: "架构选型不是背标准答案，而是把产品目标、媒体路径和运维能力放进同一张约束表。",
    visual: {
      type: "architectureDecision",
      data: {
        scenario: "200 人在线课，最多 10 人同时上麦，要求全程录制、实时字幕、弱网学生可继续听课。",
        criteria: [
          { label: "时延", question: "互动上麦能否保持自然轮转？" },
          { label: "上行", question: "教师和学生端上行是否可控？" },
          { label: "录制", question: "是否容易得到稳定、合规的录制与字幕输入？" },
          { label: "弱网", question: "是否能按接收端差异化降级？" },
          { label: "成本", question: "服务端带宽、算力和运维复杂度是否可接受？" },
        ],
        options: [
          {
            label: "P2P Mesh",
            fit: "不适合 200 人课",
            rationale: "少量上麦也会让端侧上行和连接治理变复杂，大量旁听者无法靠 Mesh 承接。",
            risks: "录制、转写、审计和弱网差异化几乎都要另做旁路系统。",
            scores: [3, 1, 1, 2, 2],
            tone: "warning",
          },
          {
            label: "SFU",
            fit: "主路径",
            rationale: "上麦者上传少量分层流，SFU 按学生网络和布局转发不同层，是在线课实时互动的主路径。",
            risks: "录制和字幕通常需要旁路订阅或媒体服务配合，跨区和大班规模要规划容量。",
            scores: [5, 4, 3, 5, 4],
            tone: "signal",
          },
          {
            label: "MCU",
            fit: "固定输出/互通",
            rationale: "如果强要求所有学生只接收一路固定混流，MCU 能简化终端和录制。",
            risks: "实时互动布局不灵活，服务端转码成本高，延迟和画质损失更明显。",
            scores: [3, 5, 5, 3, 2],
            tone: "accent",
          },
          {
            label: "边缘 SFU + 中心媒体",
            fit: "推荐组合",
            rationale: "边缘 SFU 保实时互动，中心媒体服务订阅流做录制、字幕、审核和 AI 分析。",
            risks: "系统复杂度最高，需要强观测、容量调度、故障隔离和回源策略。",
            scores: [5, 4, 5, 5, 3],
            tone: "protocol",
          },
        ],
      },
    },
    notes:
      "本页互动：每组选一个架构辩护，必须覆盖时延、上行、录制、弱网、成本五个维度。教师最后收束到“边缘 SFU + 中心媒体服务”通常是大班课的工程组合。",
  },
];

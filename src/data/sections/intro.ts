import type { Slide } from "../../types";

export const introSlides: Slide[] = [
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
];

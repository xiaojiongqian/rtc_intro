import type { Slide } from "../../types";

export const architectureSlides: Slide[] = [
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

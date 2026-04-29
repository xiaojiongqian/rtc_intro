import type { ReferenceFigureData } from "../types";

const instruction = "键盘左右或上下切换参考图；也可以点击上方编号。";
const referenceFigurePath = (path: string) => {
  const base = import.meta.env.BASE_URL;
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
};

export const referenceFigures = {
  audioAec: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/aec-flow.png"),
        alt: "AEC block diagram showing near-end speech, far-end speech, speaker echo and AEC output",
        title: "AEC 不是滤镜，而是一个有参考输入的抵消系统",
        badge: "AEC 流程",
        caption: "远端声音从扬声器放出后会串入麦克风，AEC 需要同时拿到麦克风输入和远端参考信号，才能估计并压掉回声。",
        takeaways: [
          "麦克风里混着近端人声和远端回放，不能只看单一路输入。",
          "AEC 输出仍可能有 residual echo，所以还要配合耳机、音量和双讲检测。",
          "系统音频共享时必须区分远端回放和本地要分享的有效声音。",
        ],
        tone: "signal",
      },
      {
        src: referenceFigurePath("reference-figures/aec-waveform.png"),
        alt: "Waveforms before and after acoustic echo cancellation",
        title: "波形对比：AEC 消掉的是回声成分，不是所有非人声",
        badge: "AEC 波形",
        caption: "上方是真实近端语音，中间麦克风信号混入回声，下方 AEC 输出把远端回声压低，但仍保留近端语音连续性。",
        takeaways: [
          "课堂排障要看 echo return loss、double-talk 和 residual echo，而不只看码率。",
          "强处理会改善会议可懂度，也可能误伤音乐、伴奏和系统音频。",
          "音频策略必须按外放会议、耳机场景、音乐教学分别配置。",
        ],
        tone: "accent",
      },
    ],
  },
  videoCodecEfficiency: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/codec-compression-ratio.png"),
        alt: "Compression ratio comparison from H263 to H264 H265 and AV1 across resolutions",
        title: "编码效率的收益随分辨率和场景复杂度放大",
        badge: "效率趋势",
        caption: "这张图用相对压缩率表达代际差异：H.264 是工程基准，H.265/AV1 在高分辨率和低码率下更容易体现收益。",
        takeaways: [
          "不要把图当绝对排名，真实收益取决于内容、实现、preset 和硬件路径。",
          "更高压缩效率常以编码复杂度、功耗、兼容性和专利/生态成本为代价。",
          "RTC 选型先保互通和稳定，再按端能力灰度启用高效编码。",
        ],
        tone: "protocol",
      },
      {
        src: referenceFigurePath("reference-figures/codec-rd-comparison.png"),
        alt: "Rate distortion comparison for H264 x264 libaom AV1 and wzaV1 across 360p scenes",
        title: "RD 曲线提醒我们：内容类型会改变编码器表现",
        badge: "RD 对比",
        caption: "同样是 360p，不同视频源的 PSNR-码率曲线差异很大。会议人像、复杂运动、简单画面不应共用一套码率判断。",
        takeaways: [
          "横轴是码率，纵轴是质量指标；同码率下曲线越高代表客观质量越好。",
          "会议系统要区分人像、共享屏、运动画面和弱网移动端。",
          "工程上要用自己的内容样本做 A/B，而不是只引用通用 benchmark。",
        ],
        tone: "warning",
      },
    ],
  },
  layeredEncoding: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/layer-multicast-simulcast-svc.png"),
        alt: "Comparison of multicast simulcast and SVC encoding tracks",
        title: "Simulcast 与 SVC 的关键差异是“可独立解码”与“层间依赖”",
        badge: "多质量模型",
        caption: "Simulcast 产生多条可独立解码的流；SVC 在同一源内产生基础层和增强层，增强层依赖基础层。",
        takeaways: [
          "SFU 的选择性转发能力来自发送端提前生产的质量层。",
          "Simulcast 更直观但上行/编码成本高，SVC 更细但实现和兼容更复杂。",
          "不要只讲名词，要让学生说清“接收端订阅哪一层”。",
        ],
        tone: "signal",
      },
      {
        src: referenceFigurePath("reference-figures/layer-spatial-720p.png"),
        alt: "720p spatial layer bitrate allocation pie chart",
        title: "空间层码率预算：高清层通常吃掉大部分上行",
        badge: "空间层",
        caption: "720p 示例中，1280x720 层占 67%，640x360 层占 22%，更低空间层只占小比例，但给弱网和小窗口提供兜底。",
        takeaways: [
          "大画面订阅高层，小宫格和弱网端订阅中低层，才能避免浪费。",
          "低层不是多余开销，它是弱网恢复和首帧可见性的底座。",
          "上行预算不足时，先确认层级配置是否真的服务布局。",
        ],
        tone: "protocol",
      },
      {
        src: referenceFigurePath("reference-figures/layer-temporal-bitrate.png"),
        alt: "Temporal layer bitrate allocation for 2 3 and 4 temporal layers",
        title: "时间层码率预算：流畅度也可以分层购买",
        badge: "时间层码率",
        caption: "不同时间层把帧率收益拆成多个增量预算。接收端保基础时间层即可维持低帧率连续，高层再补流畅度。",
        takeaways: [
          "降级不一定只能降分辨率，也可以先丢高时间层降低帧率。",
          "基础层要足够稳定，否则增强层再多也无法救体验。",
          "层数越多，控制更细，但编码和调度复杂度也会提高。",
        ],
        tone: "accent",
      },
      {
        src: referenceFigurePath("reference-figures/layer-temporal-numbering.png"),
        alt: "SVC temporal layer numbering and reference structure",
        title: "时间层编号越高，越容易被丢弃但越依赖基础层",
        badge: "时间层依赖",
        caption: "编号展示了时间层的参考关系：低层帧是后续增强层的根，拥塞时应优先保低层帧。",
        takeaways: [
          "SFU 丢弃增强层时不能破坏低层可解码性。",
          "时间层的价值是让帧率可降级，而不必立刻触发完整刷新。",
          "排查花屏时要区分“层丢弃”与“参考链破坏”。",
        ],
        tone: "warning",
      },
      {
        src: referenceFigurePath("reference-figures/sfu-subscription-bwe-sequence.svg"),
        alt: "Sequence diagram showing subscribers, conference server, bandwidth estimation and video layer decision",
        title: "订阅关系与带宽估计会合并成服务器的上行请求",
        badge: "SFU 订阅序列",
        caption: "A 订阅大流、C 订阅小流，服务器需要合并需求，再根据 B 到服务器的带宽估计决定 B 上传哪些视频层。",
        takeaways: [
          "下行订阅并不是孤立决策，它会反向影响发布者需要生产和上传的层。",
          "SFU 不重新编码时，层级选择必须和发布端能力协商配合。",
          "这张图适合让学生追踪“谁估计谁、谁订阅谁”。",
        ],
        tone: "signal",
      },
    ],
  },
  bandwidthControl: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/bwe-bandwidth-vs-sending.png"),
        alt: "Available bandwidth and sending bitrate over time",
        title: "发送码率必须追随可用带宽，但不能贴着上限硬冲",
        badge: "码率追踪",
        caption: "蓝线是可用带宽阶梯变化，黑线是发送码率。发送端需要探测、上升、回落，并避免把网络队列推爆。",
        takeaways: [
          "码率上升要试探，回落要果断，否则 RTT 和 jitter 会先恶化。",
          "观察 available bitrate 时要同时看 sending bitrate、loss 和 RTT。",
          "拥塞控制不是单个算法，而是编码器、pacer、RTCP 反馈的闭环。",
        ],
        tone: "signal",
      },
      {
        src: referenceFigurePath("reference-figures/bwe-rate-mode.png"),
        alt: "Full-rate mode and bandwidth-saving mode bitrate curves",
        title: "节省带宽模式会主动让码率低于全速发送",
        badge: "发送策略",
        caption: "红线表示全速模式，绿线表示节省带宽模式。RTC 在弱网中追求的是持续可交互，而不是瞬时最高画质。",
        takeaways: [
          "节省带宽不是体验降级的同义词，它可能换来更少冻结和更低排队。",
          "共享屏、人像和旁听端可以使用不同的发送策略。",
          "恢复期要阶梯上升，避免刚恢复又重新拥塞。",
        ],
        tone: "protocol",
      },
    ],
  },
  nackRtx: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/nack-rtx-sequence.png"),
        alt: "NACK RTCP request and retransmission sequence",
        title: "NACK 是包级请求，代价是一整个 RTT",
        badge: "NACK/RTX",
        caption: "接收端发现一帧里有包丢失，发送 RTCP NACK；发送端重发缺失包。能否成功取决于重传是否赶上播放 deadline。",
        takeaways: [
          "NACK 请求的是具体缺失包，不是请求刷新整幅画。",
          "RTT 越高，重传越容易晚于 jitter buffer 出队时间。",
          "拥塞队列已堆高时，重传可能让带宽预算更紧。",
        ],
        tone: "signal",
      },
    ],
  },
  pliFir: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/fir-refresh-sequence.png"),
        alt: "FIR RTCP request causing I frame refresh sequence",
        title: "FIR/PLI 请求刷新参考链，不是补一个丢包",
        badge: "FIR 序列",
        caption: "P 帧缺失导致解码错误后，接收端请求刷新。发送端用 I 帧或刷新点重建可解码状态，后续 P 帧才有可靠参考。",
        takeaways: [
          "反馈包很小，但触发的 I 帧可能很大。",
          "普通小丢包先考虑 NACK，参考链损坏才考虑 PLI/FIR。",
          "必须限频，否则会造成关键帧风暴。",
        ],
        tone: "warning",
      },
      {
        src: referenceFigurePath("reference-figures/reference-key-p-chain.png"),
        alt: "Key frame and P frame reference chain",
        title: "关键帧越近，预测链恢复越快，但码率尖峰越频繁",
        badge: "Key/P 链",
        caption: "关键帧建立新的参考根，后续 P 帧沿参考链传播。一旦根或关键参考坏掉，影响会延续到后续帧。",
        takeaways: [
          "GOP 越长，平均码率越省，但错误传播时间可能越长。",
          "频繁关键帧能缩短恢复时间，也会增加瞬时带宽压力。",
          "关键帧策略要和 PLI/FIR 限频、拥塞状态一起设计。",
        ],
        tone: "accent",
      },
      {
        src: referenceFigurePath("reference-figures/reference-golden-alt-dense.png"),
        alt: "Golden and alt reference frames with dense references",
        title: "多参考帧提升压缩效率，也增加错误传播路径",
        badge: "多参考帧",
        caption: "gold/alt 等参考帧让编码器在更多历史图像中找预测依据，压缩效率更好，但参考关系也更复杂。",
        takeaways: [
          "恢复问题不是单个包坏了这么简单，而是参考图像关系是否仍可靠。",
          "复杂参考结构需要更谨慎的丢弃、重传和刷新策略。",
          "课堂上用它解释为什么“花屏持续”通常意味着参考链已受损。",
        ],
        tone: "protocol",
      },
      {
        src: referenceFigurePath("reference-figures/reference-confirm-fail.png"),
        alt: "Reference confirmation failure diagram with gold and alt frames",
        title: "确认失败时，预测链需要回到可确认的参考点",
        badge: "确认失败",
        caption: "当参考帧无法确认可用，后续预测不能继续盲目依赖它，需要回退到已确认的参考帧或刷新点。",
        takeaways: [
          "编码器要知道哪些参考还可信，哪些应该停止使用。",
          "这解释了反馈机制为什么不仅服务重传，也服务编码器决策。",
          "弱网下的错误恢复是传输控制和编码结构共同完成的。",
        ],
        tone: "signal",
      },
    ],
  },
  fecRed: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/fec-sequence.png"),
        alt: "FEC encoding adds two packets and recovers after losing two packets",
        title: "FEC 是提前付冗余，换取不等 RTT 的恢复机会",
        badge: "FEC",
        caption: "发送端为一组媒体包添加冗余包。接收端即使丢了部分包，也可能用收到的媒体包和 FEC 包恢复一帧。",
        takeaways: [
          "FEC 适合随机丢包和高 RTT 场景，因为它不等反向反馈。",
          "冗余包和媒体包同向发送，会持续占用带宽。",
          "当链路已经拥塞，盲目加 FEC 可能让问题更重。",
        ],
        tone: "accent",
      },
    ],
  },
  plc: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/plc-jitter-buffer.png"),
        alt: "Sender receiver jitter buffer and PLC topology with packet loss",
        title: "PLC 发生在接收端播放时钟前，目标是不断音",
        badge: "PLC 拓扑",
        caption: "发送端包流到达接收端后进入 jitter buffer。某些包丢失或迟到时，PLC 在播放时钟前补出一个可播放片段。",
        takeaways: [
          "PLC 不恢复真实 RTP 包，只合成本地播放内容。",
          "它和 jitter buffer 一起决定用户听到的是断裂、重复还是连续。",
          "排查时要看 concealment 相关指标，而不是只看 packet loss。",
        ],
        tone: "signal",
      },
      {
        src: referenceFigurePath("reference-figures/plc-g711-concealment.png"),
        alt: "G711 frame erasure concealment waveform example",
        title: "G.711 丢帧隐藏：短缺口可平滑，长缺口会露馅",
        badge: "G.711 PLC",
        caption: "图中展示了输入、10ms 后、隐藏后和原始波形。PLC 让短缺口更连续，但无法凭空重建真实语音信息。",
        takeaways: [
          "短时随机丢失可被隐藏，连续丢失会产生重复、闷声或失真。",
          "用户没有听到断音，不代表链路没有丢包。",
          "QoE 监控要把 concealment 作为用户体验退化信号。",
        ],
        tone: "protocol",
      },
    ],
  },
  recoveryStrategy: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/recovery-strategy-loss-chart.png"),
        alt: "Frame rate by different packet loss at 600kbps for recovery strategies",
        title: "不同恢复策略在丢包率上升时退化曲线不同",
        badge: "策略曲线",
        caption: "600kbps 下，NACK+FIR、FEC+FIR、FIR、组合策略和多方会议策略在不同丢包率下的帧率表现并不一致。",
        takeaways: [
          "不存在单一万能恢复策略，RTT、丢包形态和会议规模会改变最优解。",
          "组合策略可能在某段 loss 区间有效，但也可能在高丢包下快速失效。",
          "让学生用图解释为什么策略排序要带副作用和适用区间。",
        ],
        tone: "warning",
      },
    ],
  },
  recordingBoundary: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/server-rtp-recording.svg"),
        alt: "Server side RTP recording topology with meeting service RTP folder storage and playback transcoding",
        title: "服务端 RTP 录制会把媒体路径延伸到存储系统",
        badge: "RTP 录制",
        caption: "客户端媒体进入会场服务后被直落到 RTP 文件夹，再经存储服务、转码和播放链路输出给观看者。",
        takeaways: [
          "录制不只是“多写一份文件”，它引入明文边界、存储生命周期和访问审计。",
          "E2EE 开启后，服务端录制能力会和隐私边界冲突。",
          "运维上要把媒体服务器、文件调度、存储和播放器一起纳入监控。",
        ],
        tone: "warning",
      },
      {
        src: referenceFigurePath("reference-figures/client-server-recording.svg"),
        alt: "Client and server recording paths including mixed recording MP4 direct RTP and transcoding",
        title: "合屏录制、直落盘和离线转码是三种不同工程路径",
        badge: "录制路径",
        caption: "图中同时出现终端、会场服务、录制服务器、MP4 文件、RTP 文件夹和离线转码，适合讲能力边界。",
        takeaways: [
          "合屏录制更方便回放，但通常需要服务端处理媒体内容。",
          "RTP 直落盘保留更多原始信息，后处理和检索链路更复杂。",
          "课堂讨论可让学生判断每条路径需要哪些授权和审计。",
        ],
        tone: "accent",
      },
    ],
  },
  deploymentExamples: {
    instruction,
    figures: [
      {
        src: referenceFigurePath("reference-figures/deployment-jsms-srs.png"),
        alt: "Example topology with App JMP H5 WebRTC mini program RTMP SRS JSMS and recording CD",
        title: "混合接入拓扑：WebRTC、RTMP、录制和调度常常共存",
        badge: "混合接入",
        caption: "这张图把 App、H5 WebRTC、小程序 RTMP、SRS、JSMS 和录制 CD 放在同一拓扑里，说明真实系统常有多协议入口。",
        takeaways: [
          "部署选型不能只看单条 P2P 或 SFU 链路，还要看接入协议和旁路能力。",
          "每增加一种入口，排障边界和指标口径都会变复杂。",
          "适合作为云、边缘和混合部署页的真实工程参照。",
        ],
        tone: "signal",
      },
      {
        src: referenceFigurePath("reference-figures/jmp-media-process.svg"),
        alt: "Juphoon Meeting Process server diagram with media channels bandwidth estimation subscribe relation SVC config QoS and recording",
        title: "媒体进程内部不只是转发，还包含 QoS、SVC 和统计收集",
        badge: "媒体进程",
        caption: "JMP 图示把媒体通道、带宽估计、订阅关系、SVC 配置、QoS 处理、统计收集、数据通道和录制放在同一服务边界内。",
        takeaways: [
          "SFU/媒体进程的价值不仅是转发，还在于反馈、订阅、统计和降级动作。",
          "一旦这些能力集中在服务端，监控和容量规划必须覆盖内部处理模块。",
          "这张图适合帮助学生把抽象架构落到工程模块。",
        ],
        tone: "protocol",
      },
      {
        src: referenceFigurePath("reference-figures/pstn-room-session.svg"),
        alt: "PSTN room session sequence with SIP gateway JSM server and JSM clients",
        title: "PSTN 接入是 RTC 系统与传统通信网络的桥",
        badge: "PSTN 序列",
        caption: "号码池预注册、发起 PSTN 呼叫、分配号码、CD 入会、Invite/ACK 和 RTP/RTCP 媒体流共同组成电话接入流程。",
        takeaways: [
          "传统语音接入会把 SIP、号码池、DTMF 和媒体会场串在一起。",
          "这类流程很长，排障时要分清信令成功、会场入会成功和媒体成功。",
          "它解释了为什么企业互通场景常保留 G.711/H.264 等底线能力。",
        ],
        tone: "warning",
      },
      {
        src: referenceFigurePath("reference-figures/pstn-dtmf-session.svg"),
        alt: "PSTN DTMF join sequence with SIP gateway CD JSM server RTP and RTCP media",
        title: "DTMF 入会流程把号码、会场 ID 和媒体路径串起来",
        badge: "DTMF 入会",
        caption: "流程从注册落地 SIP 账号、Invite offer、能力协商，到 DTMF 找会场 ID，最后建立 RTP/RTCP 和 JMP 媒体流。",
        takeaways: [
          "信令层能成功不代表媒体层已经可用，媒体流仍需单独验证。",
          "DTMF、能力协商、ACK 和 RTP/RTCP 是排障时不同阶段的证据。",
          "这张图适合放在部署页作为“企业互通复杂度”的例子。",
        ],
        tone: "accent",
      },
    ],
  },
} satisfies Record<string, ReferenceFigureData>;

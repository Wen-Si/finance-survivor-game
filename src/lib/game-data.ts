// ==========================================
// 金融职场生存游戏 - 场景与数据系统
// 10000+ 场景通过组合生成
// ==========================================

// ===== 工具函数 =====
export function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ===== 职业轨道 =====
export const CAREER_TRACKS = [
  '投资银行', '商业银行', '证券交易', '基金管理', '风险投资',
  '保险精算', '财务顾问', '审计税务', '金融科技', '量化分析',
  '资产管理', '私募股权', '对冲基金', '信用评级', '金融监管',
  '企业财务', '财富管理', '金融咨询', '供应链金融', '绿色金融',
] as const;

// ===== 职位层级 =====
export const POSITION_LEVELS = [
  '实习生', '分析师', '高级分析师', '经理', '高级经理',
  '总监', '副总裁', '高级副总裁', '执行副总裁', '合伙人',
  '董事总经理', '首席官',
] as const;

// ===== 公司类型 =====
export const COMPANY_TYPES = [
  '国际投行', '国有银行', '股份制银行', '头部券商', '公募基金',
  '私募基金', '保险公司', '信托公司', '金融科技公司', '咨询公司',
  '四大会计师事务所', '评级机构', '交易所', '金融控股集团', '外资银行',
] as const;

// ===== 品格特质 =====
export const PERSONALITY_TRAITS = [
  '果断', '谨慎', '野心勃勃', '沉稳', '圆滑',
  '正直', '投机', '保守', '激进', '隐忍',
  '善于交际', '独来独往', '善于领导', '团队协作', '创新思维',
  '守规矩', '敢于冒险', '善于算计', '重情义', '冷酷理性',
] as const;

// ===== 专业技能 =====
export const PROFESSIONAL_SKILLS = [
  '财务建模', '估值分析', '风险评估', '投资组合管理', '衍生品定价',
  '量化交易', '信用分析', '市场研究', '合规审查', '税务筹划',
  '并购重组', 'IPO承销', '债券发行', '资产证券化', '风控建模',
  '数据挖掘', '机器学习', '区块链技术', '智能合约', '算法交易',
  '宏观经济分析', '行业研究', '财务报表分析', '现金流管理', '资产负债管理',
  '压力测试', '蒙特卡洛模拟', '黑天鹅防御', '高频交易', 'ESG评估',
] as const;

// ===== 场景类别 =====
export const SCENE_CATEGORIES = [
  '日常办公', '客户会议', '项目汇报', '危机处理', '社交应酬',
  '内部竞争', '行业峰会', '监管审查', '市场波动', '人事变动',
  '业务拓展', '合规挑战', '技术革新', '团队管理', '跨部门协作',
  '职业抉择', '道德困境', '投资决策', '风险事件', '晋升考核',
] as const;

// ===== 事件触发条件 =====
export const EVENT_TRIGGERS = [
  '季度业绩', '年度考核', '市场崩盘', '政策变化', '公司并购',
  '领导更替', '客户流失', '合规处罚', '技术突破', '行业洗牌',
  '经济衰退', '牛市狂潮', '黑天鹅事件', '内部举报', '媒体曝光',
] as const;

// ===== 成就列表 =====
export const ACHIEVEMENTS = [
  '初入职场', '第一桶金', '人脉达人', '技术专家', '管理新星',
  '危机化解者', '业绩冠军', '合规标兵', '创新先锋', '团队领袖',
  '百万交易', '千万项目', '行业认可', '客户信赖', '内部晋升',
  '逆风翻盘', '稳如泰山', '金融精英', '职场老手', '传奇人物',
  '风控大师', '投资圣手', '谈判专家', '战略眼光', '道德楷模',
] as const;

// ===== 游戏结束原因 =====
export const GAME_OVER_REASONS = [
  { condition: 'health', threshold: 0, reason: '身体崩溃，不得不退出职场' },
  { condition: 'mentalHealth', threshold: 0, reason: '精神状态严重恶化，无法继续工作' },
  { condition: 'reputation', threshold: 5, reason: '声誉彻底崩塌，被行业封杀' },
  { condition: 'wealth', threshold: -100, reason: '负债累累，宣告破产' },
  { condition: 'compliance', threshold: 5, reason: '严重违规，被吊销从业资格' },
] as const;

// ===== 角色接口 =====
export interface GameCharacter {
  id: string;
  userId: string;
  name: string;
  personality: string;
  skills: string[];
  careerDirection: string;
  background: string;
  attributes: CharacterAttributes;
  currentDay: number;
  isAlive: boolean;
  events: GameEvent[];
  lastSimulated: number;
  createdAt: number;
}

export interface CharacterAttributes {
  intelligence: number;
  charisma: number;
  resilience: number;
  ethics: number;
  ambition: number;
  luck: number;
  financialAcumen: number;
  technicalSkill: number;
  networkStrength: number;
  leadership: number;
  compliance: number;
  health: number;
  mentalHealth: number;
  reputation: number;
  wealth: number;
  stress: number;
  position: string;
  company: string;
  experience: number;
  achievements: string[];
  failures: string[];
}

export interface GameEvent {
  id: string;
  day: number;
  category: string;
  title: string;
  description: string;
  aiDecision: string;
  consequence: string;
  attributeChanges: Record<string, number>;
  timestamp: number;
}

// ===== 场景模板系统 =====
// 通过组合模板 + 变量替换生成 10000+ 唯一场景

const SCENE_TEMPLATES: Record<string, string[]> = {
  '日常办公': [
    '今天的工作从处理{doc_type}开始，{task_desc}，需要在{time_limit}内完成。',
    '上午收到{boss}的邮件，要求对{subject}进行{analysis_type}分析。',
    '办公桌上堆满了{doc_type}，{urgency}需要处理{count}份文件。',
    '{colleague}来请教{topic}的问题，你花了{duration}帮忙解答。',
    '系统升级导致{system}暂时无法使用，{impact_desc}。',
    '今天的{meeting_type}会议持续了{duration}，讨论了{topic}。',
    '收到{department}发来的{doc_type}，需要{action}后返回。',
    '{time_of_day}，你正在{task}，突然{interruption}。',
    '整理{doc_type}时发现了{finding}，这可能会{impact_desc}。',
    '加班到{time_of_day}，终于完成了{project}的{deliverable}。',
  ],
  '客户会议': [
    '与{client}的{meeting_type}会议即将开始，议题是{topic}。',
    '{client}的{vip}亲自出席了会议，对{subject}提出了{demand}。',
    '会议中，{client}对{product}的{aspect}表示{reaction}。',
    '向{client}展示{product}方案时，{interruption}。',
    '{client}要求在{deadline}前提供{deliverable}，否则{threat_negotiation}。',
    '与{client}的谈判进入关键阶段，{stakeholder}提出了{condition}。',
    '会议结束后，{client}的{role}私下表示{feedback}。',
    '{client}对{amount}的{product}很感兴趣，但{concern}。',
    '准备{client}的{meeting_type}材料时，发现{finding}。',
    '{client}突然取消了{meeting_type}，原因是{reason}。',
  ],
  '项目汇报': [
    '向{boss}汇报{project}的进展，{status_desc}。',
    '{project}的{metric}未达预期，需要{action}。',
    '在汇报{project}时，{boss}对{aspect}提出了{question}。',
    '{project}取得了{achievement}，{boss}表示{reaction}。',
    '汇报中提到{finding}，引起了{stakeholder}的{reaction}。',
    '{project}的{risk}需要{action}，{deadline}前必须解决。',
    '跨部门汇报{project}，{department}对{aspect}有{concern}。',
    '{project}进入{phase}阶段，需要{resource}支持。',
    '汇报结束后，{boss}决定{decision}。',
    '{project}的{deliverable}需要{action}，{impact_desc}。',
  ],
  '危机处理': [
    '{crisis_type}突然爆发，{impact_desc}，需要{response}。',
    '{crisis_type}导致{loss_desc}，{stakeholder}要求{action}。',
    '面对{crisis_type}，{department}的{role}建议{strategy}。',
    '{crisis_type}的影响在{scope}范围内扩散，{response}。',
    '紧急召开{meeting_type}会议，讨论{crisis_type}的{aspect}。',
    '{crisis_type}的根源是{root_cause}，需要{action}。',
    '在{crisis_type}中，{colleague}的{action_result}。',
    '{crisis_type}的{phase}阶段，{strategy}。',
    '处理{crisis_type}时，发现了{finding}。',
    '{crisis_type}过后，{lesson}。',
  ],
  '社交应酬': [
    '晚上与{vip}在{venue}聚餐，{purpose}。',
    '{boss}邀请你参加{event}，{stakeholder}也会出席。',
    '在{event}上遇到了{influencer}，{interaction}。',
    '{colleague}组织了{activity}，{stakeholder}都参加了。',
    '与{client}的{vip}在{venue}商谈{subject}。',
    '应酬中，{vip}提到了{insider_info}。',
    '{boss}在{venue}对你说了{feedback}。',
    '社交场合中，{stakeholder}向你透露了{information}。',
    '在{event}上，你的{quality}给{influencer}留下了深刻印象。',
    '应酬结束后，{consequence}。',
  ],
  '内部竞争': [
    '{colleague}也在争取{opportunity}，{situation}。',
    '{boss}暗示{competition}，{stakeholder}都在关注。',
    '{department}有一个{opportunity}，{count}个人在竞争。',
    '{colleague}的{performance}引起了{boss}的注意。',
    '在{project}中，{colleague}的{action_result}。',
    '{boss}让你和{colleague}分别{task}，{purpose}。',
    '{competition}的结果即将公布，{situation}。',
    '{colleague}在{boss}面前{action_result}。',
    '面对{competition}，你决定{strategy}。',
    '{competition}的{consequence}。',
  ],
  '行业峰会': [
    '参加{event}，{influencer}发表了关于{topic}的演讲。',
    '在{event}上，{trend}成为热门话题。',
    '{influencer}在{event}上分享了{insight}。',
    '峰会上，{company}发布了{announcement}。',
    '与{influencer}在{event}上交流了{topic}。',
    '{event}的主题是{topic}，{stakeholder}都出席了。',
    '在{event}的{session}上，{discussion}。',
    '{trend}在{event}上引发{reaction}。',
    '{influencer}在{event}上提到了{prediction}。',
    '峰会结束后，{consequence}。',
  ],
  '监管审查': [
    '{regulator}对{company}进行{audit_type}审查。',
    '收到{regulator}的{notice}，要求{action}。',
    '{audit_type}审查发现{finding}，需要{response}。',
    '{regulator}对{subject}提出了{requirement}。',
    '在{audit_type}中，{violation}被指出。',
    '准备{regulator}要求的{deliverable}，{deadline}前提交。',
    '{regulator}对{company}的{aspect}表示{assessment}。',
    '{audit_type}的结果是{result}，{consequence}。',
    '配合{regulator}的{audit_type}，{task_desc}。',
    '{regulator}发布了{policy}，{impact_desc}。',
  ],
  '市场波动': [
    '{market_event}导致{market_impact}，{response_needed}。',
    '{market_indicator}出现{signal_trade}，{analysis}。',
    '{asset_class}价格{price_move}，{reason}。',
    '{market_event}对{company}的{aspect}产生{impact}。',
    '面对{market_condition}，{strategy}。',
    '{market_event}引发{reaction}，{stakeholder}要求{action}。',
    '{market_indicator}显示{signal_trade}，{prediction}。',
    '{market_event}后，{opportunity}出现。',
    '{asset_class}的{metric}达到{level}，{analysis}。',
    '{market_condition}下，{department}的{task_desc}。',
  ],
  '人事变动': [
    '{boss}宣布{hr_event}，{impact_desc}。',
    '{colleague}被{hr_action}，{reason}。',
    '{department}进行{hr_event}，{consequence}。',
    '{boss}的{position}由{person}接任，{reaction}。',
    '公司宣布{hr_event}，{stakeholder}的反应是{reaction}。',
    '{hr_event}后，{department}的{situation}。',
    '你被{hr_action}，{consequence}。',
    '{colleague}的{hr_action}对你{impact}。',
    '{hr_event}的消息在{scope}传开，{reaction}。',
    '{boss}找你谈话，{subject}。',
  ],
  '业务拓展': [
    '{opportunity}出现在{market}，{action_needed}。',
    '{client}对{product}表示{interest}，{next_step}。',
    '{market}的{trend}带来{opportunity}。',
    '与{partner}合作开发{product}，{plan}。',
    '{competitor}在{market}的{action_result}，{response_needed}。',
    '{client}的{requirement}需要{solution}。',
    '{market}的{opportunity}需要{resource}。',
    '拓展{market}时遇到{challenge}，{strategy}。',
    '{product}在{market}的{performance}，{analysis}。',
    '{partner}提出{proposal}，{assessment}。',
  ],
  '合规挑战': [
    '{compliance_issue}被发现，{action_needed}。',
    '{regulation}即将生效，{impact_desc}。',
    '{department}的{practice}存在{compliance_risk}。',
    '{compliance_issue}需要{deadline}前{action}。',
    '{regulator}发布了{guideline}，{requirement}。',
    '在{process}中发现{compliance_issue}，{response}。',
    '{compliance_risk}可能导致{consequence}。',
    '{department}需要{action}来满足{regulation}。',
    '{compliance_issue}的{root_cause}是{finding}。',
    '面对{compliance_challenge}，{strategy}。',
  ],
  '技术革新': [
    '{technology}在{field}的应用取得{breakthrough}。',
    '{company}推出了{tech_product}，{impact_desc}。',
    '{technology}可能{impact}你的{aspect}工作。',
    '学习{technology}的{skill}，{plan}。',
    '{tech_event}改变了{field}的{aspect}。',
    '{technology}的{advantage}让{stakeholder}考虑{action}。',
    '在{project}中引入{technology}，{challenge}。',
    '{tech_product}的{feature}可以{benefit}。',
    '{technology}的{risk}需要{mitigation}。',
    '{tech_trend}对{industry}的{impact}。',
  ],
  '团队管理': [
    '{team_member}的{performance_issue}需要{action}。',
    '团队{team_event}，{impact_desc}。',
    '{team_member}提出了{proposal_work}，{assessment}。',
    '团队需要在{deadline}前完成{task}，{situation}。',
    '{team_conflict}需要{resolution}。',
    '{team_member}的{achievement}值得{recognition}。',
    '分配{task}给{team_member}，{consideration}。',
    '团队的{metric}显示{finding}，{action_needed}。',
    '{team_event}后，{morale}。',
    '作为{role}，你需要{leadership_action}。',
  ],
  '跨部门协作': [
    '{department1}和{department2}在{project}上需要{collaboration}。',
    '{department1}的{requirement}与{department2}的{constraint}冲突。',
    '协调{department1}和{department2}的{resource}分配。',
    '{department1}的{deliverable}延迟影响了{department2}的{task}。',
    '在{project}中，{department1}负责{aspect1}，{department2}负责{aspect2}。',
    '{department1}和{department2}的{conflict}需要{resolution}。',
    '跨部门{meeting_type}讨论{project}的{issue}。',
    '{department1}的{finding}对{department2}的{work}有{impact}。',
    '建立{department1}和{department2}的{process}，{purpose}。',
    '{collaboration}的结果是{outcome}。',
  ],
  '职业抉择': [
    '{opportunity}出现，但{trade_off}。',
    '{choice1}还是{choice2}，{consideration}。',
    '{offer}来自{company}，{condition}。',
    '{current_situation}让你考虑{alternative}。',
    '{boss}提供了{opportunity}，{requirement}。',
    '面对{career_crossroad}，{factor}是关键考量。',
    '{opportunity}的{pro}和{con}需要{analysis}。',
    '{choice}可能{impact}你的{aspect}。',
    '{mentor}建议{advice}，{reasoning}。',
    '{decision}的{consequence}。',
  ],
  '道德困境': [
    '{ethical_dilemma}，{stakeholder}的{interest}受到影响。',
    '{temptation}出现，{consequence_if_accepted}。',
    '{colleague}的{questionable_action}，{your_choice}。',
    '{ethical_issue}涉及{stakeholder}，{dilemma}。',
    '{shortcut}可以{benefit}，但{ethical_concern}。',
    '{information_access}让你知道{insider_info}，{dilemma}。',
    '{pressure}来自{boss}，{questionable_request}。',
    '{ethical_choice}的{consequence}。',
    '面对{ethical_dilemma}，{principle}是关键。',
    '{whistleblower_situation}，{your_decision}。',
  ],
  '投资决策': [
    '{investment_opportunity}，{analysis_result}。',
    '{asset}的{valuation}显示{signal}。',
    '{portfolio_rebalancing}，{rationale}。',
    '{risk_assessment}显示{finding}，{action}。',
    '{market_signal}提示{strategy}。',
    '{investment}的{due_diligence}发现{finding}。',
    '{fund}的{performance}，{decision}。',
    '{asset_class}的{allocation}需要{adjustment}。',
    '{investment_decision}的{consequence}。',
    '{risk_return}分析，{recommendation}。',
  ],
  '风险事件': [
    '{risk_event}发生，{impact_desc}。',
    '{risk_indicator}达到{level}，{response}。',
    '{risk_type}的{exposure}超过{threshold}。',
    '{risk_event}导致{loss_desc}，{mitigation}。',
    '{risk_assessment}发现{finding}，{action_needed}。',
    '{systemic_risk}的{probability}增加，{preparation_risk}。',
    '{operational_risk}事件，{root_cause}。',
    '{risk_event}的{contagion}效应，{scope}。',
    '面对{risk_event}，{strategy}。',
    '{risk_mitigation}的{cost_benefit}。',
  ],
  '晋升考核': [
    '{evaluation_period}考核即将开始，{preparation}。',
    '{boss}对你的{aspect}进行了{assessment}。',
    '{promotion_opportunity}，{requirement}。',
    '{competitor}也在争取{position}，{situation}。',
    '{evaluation_result}，{consequence}。',
    '{boss}的{feedback}，{action_needed}。',
    '{performance_review}中，{highlight}。',
    '{promotion_criteria}的{gap}，{plan_career}。',
    '{evaluation}的{outcome_career}，{next_step_career}。',
    '{career_milestone}，{reflection}。',
  ],
};

// ===== 模板变量值 =====
const TEMPLATE_VARS: Record<string, string[]> = {
  // 人物
  '{boss}': ['大老板', '部门总', '分管领导', '董事长'],
  '{colleague}': ['小刘', '老张', '王经理', '李总监', '陈副总'],
  '{vip}': ['董事长', '市长', '行业泰斗', '监管领导'],
  '{influencer}': ['行业大佬', '知名投资人', '监管高层', '学术权威'],
  '{stakeholder}': ['CEO', '董事会', '客户', '监管机构', '投资人'],
  '{role}': ['项目负责人', '部门主管', '合规负责人', '风控官'],
  '{team_member}': ['小刘', '小陈', '老王', '小李', '张姐'],
  '{mentor}': ['前领导', '行业前辈', '导师', '老同事'],
  '{person}': ['新任领导', '外部空降', '内部提拔', '猎头挖来的人'],
  '{partner}': ['某科技公司', '行业龙头', '外资机构', '创新企业'],
  '{regulator}': ['银保监会', '证监会', '央行', '交易所', '行业协会'],

  // 公司与部门
  '{company}': ['公司', '集团', '总部', '分公司'],
  '{department}': ['风控部', '合规部', '交易部', '研究部', '运营部'],
  '{department1}': ['前台业务部', '投资部', '交易部'],
  '{department2}': ['中台风控部', '合规部', '运营部'],
  '{client}': ['某大型国企', '知名互联网公司', '外资机构', '政府基金', '上市公司'],
  '{competitor}': ['某国际投行', '头部券商', '知名基金', '金融科技公司'],

  // 文档与产出
  '{doc_type}': ['报告', '分析', '方案', '备忘录', '审批文件'],
  '{deliverable}': ['完整方案', '修订报告', '补充材料', '最终版本'],
  '{product}': ['资产配置', '风险管理', '投资组合', '融资方案'],
  '{asset}': ['股票组合', '债券组合', '衍生品头寸', '另类投资'],
  '{fund}': ['成长基金', '价值基金', '指数基金', '对冲基金'],
  '{portfolio}': ['投资组合', '基金产品', '资管计划', '信托产品'],
  '{tech_product}': ['智能投顾系统', '风控平台', '交易算法', '数据分析工具'],

  // 时间与数量
  '{time_limit}': ['今天下班前', '明天上午', '本周内', '三天内'],
  '{deadline}': ['明天', '本周', '三天内', '下周一'],
  '{duration}': ['两个小时', '一整个下午', '大半天', '半小时'],
  '{time_of_day}': ['深夜', '凌晨', '傍晚', '午后'],
  '{count}': ['三', '五', '十几', '数十'],
  '{amount}': ['数亿', '数十亿', '上千万', '百亿级'],
  '{level}': ['历史新高', '警戒线', '临界点', '异常水平'],

  // 活动与事件
  '{meeting_type}': ['战略', '项目', '评审', '决策', '周例'],
  '{event}': ['金融论坛', '行业峰会', '投资年会', '圆桌会议'],
  '{session}': ['专题讨论', '圆桌对话', '主题演讲', '闭门会议'],
  '{activity}': ['团建活动', '部门聚餐', '行业交流', '培训课程'],
  '{venue}': ['高级餐厅', '私人会所', '高尔夫球场', '咖啡厅'],
  '{project}': ['并购重组', 'IPO', '资产证券化', '风险对冲', '量化策略'],

  // 描述性词汇
  '{task_desc}': ['需要仔细核对数据', '涉及多个部门协调', '关系到重要客户', '时间紧迫'],
  '{urgency}': ['紧急', '非常紧急', '刻不容缓地', '优先'],
  '{task}': ['撰写报告', '分析数据', '准备材料', '审核文件'],
  '{action}': ['修改', '补充', '审批', '确认'],
  '{finding}': ['一个重要细节', '一处数据异常', '一份关键文件', '一个隐藏风险'],
  '{impact_desc}': ['影响整体进度', '可能改变决策方向', '需要重新评估', '引起高层关注'],
  '{status_desc}': ['进展顺利', '遇到一些困难', '基本按计划推进', '略有延迟'],
  '{achievement}': ['重大突破', '阶段性成果', '超预期完成', '关键里程碑'],
  '{loss_desc}': ['巨大损失', '严重亏损', '客户流失', '声誉受损'],
  '{interaction}': ['交换了名片', '深入交谈', '建立了联系', '达成初步共识'],
  '{feedback}': ['对你的表现很满意', '提出了更高要求', '暗示了晋升可能', '表达了担忧'],
  '{question}': ['尖锐的问题', '深入的追问', '关键的质疑', '建设性的建议'],
  '{concern}': ['一些顾虑', '风险担忧', '合规问题', '时间压力'],
  '{reaction}': ['高度认可', '表示满意', '提出质疑', '保持观望'],
  '{demand}': ['更高的收益要求', '更严格的风控标准', '更快的交付速度', '更详细的方案'],
  '{threat_negotiation}': ['将考虑其他合作方', '可能缩减合作规模', '需要重新评估关系', '会影响续约'],
  '{condition}': ['能满足特定条件', '在规定时间内完成', '提供额外保障', '调整费率'],
  '{reason}': ['临时有急事', '内部决策变化', '需要更多准备时间', '策略调整'],
  '{insight}': ['对行业趋势的独到见解', '前沿的研究成果', '实战经验总结', '大胆的预测'],
  '{announcement}': ['新产品线', '战略转型计划', '重大合作', '技术突破'],
  '{discussion}': ['引发了热烈讨论', '产生了分歧', '达成了共识', '提出了新观点'],
  '{prediction}': ['市场将迎来重大变革', '监管政策将收紧', '新技术将颠覆行业', '新的增长点即将出现'],
  '{notice}': ['问询函', '整改通知', '处罚决定', '指导意见'],
  '{audit_type}': ['合规', '财务', '业务', '风险'],
  '{violation}': ['多处违规', '重大缺陷', '系统性问题', '故意隐瞒'],
  '{result}': ['基本合规', '需要整改', '存在重大问题', '整体良好'],
  '{policy}': ['新监管政策', '行业指引', '实施细则', '风险提示'],
  '{requirement}': ['限期整改', '补充材料', '加强内控', '提交报告'],
  '{guideline}': ['操作指引', '合规手册', '风控标准', '行为准则'],
  '{compliance_issue}': ['流程违规', '数据偏差', '报告遗漏', '审批缺失'],
  '{compliance_risk}': ['合规风险', '操作风险', '法律风险', '声誉风险'],
  '{compliance_challenge}': ['新的合规要求', '跨境监管差异', '数据隐私规定', '反洗钱要求'],
  '{practice}': ['业务操作', '客户管理', '交易执行', '信息披露'],
  '{process}': ['审批流程', '交易流程', '报告流程', '风控流程'],
  '{root_cause}': ['流程缺陷', '人为失误', '系统故障', '制度漏洞'],
  '{technology}': ['人工智能', '区块链', '大数据', '云计算'],
  '{field}': ['风控', '交易', '合规', '客户服务'],
  '{breakthrough}': ['重大突破', '显著进展', '实质性成果', '阶段性成功'],
  '{tech_event}': ['技术升级', '系统迁移', '平台重构', '算法优化'],
  '{advantage}': ['效率优势', '成本优势', '精度优势', '速度优势'],
  '{feature}': ['智能分析', '实时监控', '自动预警', '精准预测'],
  '{benefit}': ['大幅提升效率', '降低操作风险', '节省人力成本', '提高决策质量'],
  '{risk}': ['技术风险', '安全风险', '兼容性风险', '过渡期风险'],
  '{mitigation}': ['分阶段实施', '加强测试', '制定回滚方案', '增加监控'],
  '{tech_trend}': ['数字化转型', '智能化升级', '平台化发展', '生态化布局'],
  '{industry}': ['金融业', '银行业', '证券业', '保险业'],
  '{performance_issue}': ['业绩下滑', '工作态度问题', '能力不足', '团队配合不佳'],
  '{team_event}': ['取得重大成果', '遭遇挫折', '人员变动', '结构调整'],
  '{proposal_work}': ['新的工作方案', '流程优化建议', '创新项目计划', '培训需求'],
  '{team_conflict}': ['意见分歧', '资源争夺', '责任推诿', '沟通不畅'],
  '{recognition}': ['表彰', '奖励', '晋升推荐', '公开表扬'],
  '{consideration}': ['考虑成员特长', '平衡工作负荷', '提供成长机会', '确保项目进度'],
  '{morale}': ['士气高涨', '需要激励', '略显疲惫', '重新振作'],
  '{leadership_action}': ['做出艰难决定', '激励团队', '制定新策略', '协调资源'],
  '{collaboration}': ['紧密配合', '资源共享', '联合攻关', '协同推进'],
  '{conflict}': ['利益冲突', '目标不一致', '沟通障碍', '资源竞争'],
  '{resolution}': ['协调解决', '上报决策', '折中方案', '重新分工'],
  '{resource}': ['人力', '资金', '技术', '时间'],
  '{opportunity}': ['一个晋升机会', '一个重要项目', '一个转岗机会', '一个创业邀请'],
  '{trade_off}': ['需要放弃现有稳定', '意味着更大压力', '可能影响家庭', '风险与收益并存'],
  '{choice1}': ['留在当前岗位', '接受新挑战', '继续深造', '转换赛道'],
  '{choice2}': ['跳槽到新公司', '保持现状', '内部转岗', '自主创业'],
  '{choice}': ['接受', '拒绝', '推迟决定', '提出条件'],
  '{consideration_var}': ['需要综合考虑', '值得深思', '不能草率决定', '要权衡利弊'],
  '{offer}': ['一份诱人的offer', '一个合作邀请', '一个投资机会', '一个培训名额'],
  '{current_situation}': ['职业瓶颈', '收入增长乏力', '工作缺乏挑战', '发展空间受限'],
  '{alternative}': ['跳槽', '转行', '创业', '深造'],
  '{career_crossroad}': ['职业十字路口', '关键转折点', '重大选择', '人生岔路'],
  '{factor}': ['家庭', '收入', '发展空间', '个人兴趣'],
  '{pro}': ['优势明显', '前景广阔', '收入丰厚', '平台更好'],
  '{con}': ['风险较大', '不确定性高', '压力巨大', '需要重新适应'],
  '{advice}': ['稳中求进', '大胆尝试', '三思而后行', '抓住机遇'],
  '{reasoning}': ['基于多年经验', '考虑当前形势', '权衡利弊后', '从长远角度'],
  '{ethical_dilemma}': ['利益与原则的冲突', '合规与业绩的矛盾', '人情与规则的碰撞', '短期利益与长期声誉'],
  '{temptation}': ['一个灰色地带的机会', '一笔可观的额外收入', '一个捷径', '一份内部信息'],
  '{consequence_if_accepted}': ['但可能违反规定', '但存在道德风险', '但可能损害他人利益', '但违背职业操守'],
  '{questionable_action}': ['行为值得商榷', '做法有违规嫌疑', '操作存在灰色地带', '决定可能不妥'],
  '{your_choice}': ['你如何应对', '你会怎么做', '你的立场是什么', '你选择沉默还是发声'],
  '{ethical_issue}': ['利益冲突', '信息泄露', '不公平竞争', '虚假陈述'],
  '{dilemma}': ['左右为难', '进退两难', '难以抉择', '内心挣扎'],
  '{shortcut}': ['走捷径', '省略流程', '降低标准', '变通处理'],
  '{benefit_var}': ['快速达成目标', '获得短期利益', '赢得竞争优势', '节省大量时间'],
  '{ethical_concern}': ['但可能埋下隐患', '但违背职业操守', '但存在合规风险', '但损害长期信誉'],
  '{information_access}': ['职务之便', '系统权限', '内部渠道', '人脉关系'],
  '{insider_info}': ['未公开的财务数据', '即将发生的并购', '人事变动消息', '监管政策变化'],
  '{pressure}': ['巨大压力', '强烈暗示', '明确要求', '软硬兼施'],
  '{questionable_request}': ['让你做违背原则的事', '要求你配合不当操作', '暗示你忽略某些问题', '要求你修改数据'],
  '{ethical_choice}': ['坚持原则', '妥协让步', '寻求折中', '向上反映'],
  '{principle}': ['职业操守', '法律法规', '个人底线', '行业规范'],
  '{whistleblower_situation}': ['发现了违规行为', '目睹了不当操作', '得知了隐瞒的信息', '面对举报抉择'],
  '{your_decision}': ['你选择举报', '你选择沉默', '你选择私下提醒', '你选择收集证据'],
  '{investment_opportunity}': ['一个新兴市场投资机会', '一只被低估的股票', '一个另类投资项目', '一个并购套利机会'],
  '{analysis_result}': ['风险收益比良好', '需要进一步尽调', '存在潜在风险', '时机恰到好处'],
  '{valuation}': ['估值模型', 'DCF分析', '相对估值', '资产评估'],
  '{signal_trade}': ['买入信号', '卖出信号', '持有信号', '预警信号'],
  '{portfolio_rebalancing}': ['投资组合需要调整', '资产配置需要优化', '风险敞口需要控制', '仓位需要管理'],
  '{rationale}': ['基于市场变化', '根据风控要求', '考虑流动性需求', '优化收益风险比'],
  '{risk_assessment}': ['风险评估', '压力测试', '情景分析', '敏感性分析'],
  '{market_signal}': ['市场技术指标', '基本面数据', '资金流向', '情绪指标'],
  '{due_diligence}': ['尽职调查', '背景调查', '财务审计', '法律审查'],
  '{allocation}': ['配置比例', '仓位权重', '资产分布', '风险预算'],
  '{adjustment}': ['调整', '优化', '再平衡', '重新配置'],
  '{risk_return}': ['风险收益', '夏普比率', '最大回撤', '信息比率'],
  '{recommendation}': ['建议加仓', '建议减仓', '建议持有', '建议对冲'],
  '{risk_event}': ['黑天鹅事件', '系统性风险', '流动性危机', '信用事件'],
  '{risk_indicator}': ['风险指标', '波动率', 'VaR', '信用利差'],
  '{risk_type}': ['市场风险', '信用风险', '操作风险', '流动性风险'],
  '{exposure}': ['风险敞口', '头寸规模', '杠杆水平', '集中度'],
  '{threshold}': ['限额', '预警线', '容忍度', '监管要求'],
  '{mitigation_var}': ['需要采取对冲措施', '需要降低敞口', '需要增加缓冲', '需要启动应急预案'],
  '{systemic_risk}': ['系统性风险', '连锁反应', '传染效应', '市场恐慌'],
  '{probability}': ['发生概率', '冲击力度', '影响范围', '持续时间'],
  '{preparation_risk}': ['做好防范准备', '制定应对方案', '加强监控', '增加流动性储备'],
  '{operational_risk}': ['操作失误', '系统故障', '流程缺陷', '人为错误'],
  '{contagion}': ['蔓延', '扩散', '传导', '溢出'],
  '{risk_mitigation}': ['风险缓释措施', '对冲策略', '保险安排', '应急预案'],
  '{cost_benefit}': ['成本与收益需要权衡', '效果显著但成本较高', '短期成本长期收益', '投入产出比合理'],
  '{evaluation_period}': ['季度', '半年度', '年度', '试用期'],
  '{preparation}': ['需要准备述职材料', '需要总结业绩亮点', '需要整理项目成果', '需要收集反馈意见'],
  '{promotion_opportunity}': ['一个晋升机会', '一个加薪名额', '一个重要岗位', '一个管理职位'],
  '{position}': ['经理', '总监', '副总裁', '合伙人'],
  '{evaluation_result}': ['考核结果优秀', '考核结果良好', '考核结果合格', '考核有待提升'],
  '{action_needed}': ['需要采取行动', '需要立即处理', '需要重点关注', '需要制定计划'],
  '{highlight}': ['业绩突出', '团队贡献大', '创新能力強', '客户评价高'],
  '{gap}': ['还有差距', '需要加强', '有待提升', '尚需努力'],
  '{plan_career}': ['制定提升计划', '寻求培训机会', '找导师指导', '争取更多项目'],
  '{outcome_career}': ['成功晋升', '获得加薪', '得到认可', '需要再接再厉'],
  '{next_step_career}': ['下一步计划', '新的目标', '改进方向', '发展路径'],
  '{career_milestone}': ['入职周年', '完成重大项目', '获得行业认可', '达成职业目标'],
  '{reflection}': ['回顾成长历程', '总结经验教训', '展望未来发展', '感恩一路同行'],

  // 市场相关
  '{market}': ['新兴市场', '债券市场', '衍生品市场', '数字资产市场'],
  '{market_event}': ['央行意外加息', '地缘政治冲突', '黑天鹅事件', '重大经济数据发布'],
  '{market_impact}': ['市场剧烈波动', '流动性骤降', '风险偏好急转', '资产价格重估'],
  '{response_needed}': ['需要迅速应对', '需要重新评估仓位', '需要启动应急预案', '需要安抚客户'],
  '{market_indicator}': ['PMI指数', 'CPI数据', '就业报告', '利率决议'],
  '{signal}': ['反转信号', '趋势加速信号', '背离信号', '突破信号'],
  '{analysis}': ['需要重新审视策略', '市场逻辑可能改变', '需要调整预期', '值得关注后续发展'],
  '{asset_class}': ['股票', '债券', '商品', '外汇'],
  '{price_move}': ['大幅上涨', '急剧下跌', '剧烈震荡', '突破关键位'],
  '{market_condition}': ['极端市场条件', '低流动性环境', '高波动率时期', '趋势性行情'],
  '{trend}': ['ESG投资', '数字货币', '去中心化金融', '量化投资'],
  '{market_signal_var}': ['技术面信号', '基本面变化', '资金面异动', '政策面转向'],
  '{assessment}': ['高度关注', '审慎评估', '积极应对', '密切跟踪'],
  '{interest}': ['浓厚兴趣', '初步意向', '强烈需求', '探索性咨询'],
  '{next_step}': ['需要准备详细方案', '安排下次会面', '进行内部评估', '启动尽调流程'],
  '{plan}': ['分三个阶段推进', '先试点再推广', '联合开发', '技术合作'],
  '{action_result}': ['表现抢眼', '出了差错', '提出了不同意见', '抢先一步'],
  '{response_needed_var}': ['需要快速反应', '需要调整策略', '需要重新定位', '需要加强差异化'],
  '{solution}': ['创新解决方案', '定制化服务', '技术赋能方案', '综合金融方案'],
  '{performance}': ['市场表现优异', '业绩稳健增长', '出现回撤', '跑赢基准'],
  '{proposal}': ['合作方案', '投资建议', '战略规划', '创新构想'],
  '{challenge}': ['文化差异', '监管障碍', '技术壁垒', '人才短缺'],
  '{strategy}': ['差异化竞争', '成本领先', '快速跟进', '创新驱动'],
  '{aspect}': ['核心业务', '风控体系', '客户关系', '技术架构'],
  '{subject}': ['投资策略', '风控模型', '业务规划', '合规体系'],
  '{analysis_type}': ['深度', '比较', '趋势', '敏感性'],
  '{topic}': ['市场走势', '行业前景', '技术革新', '政策影响'],
  '{system}': ['交易系统', '风控系统', '结算系统', '信息系统'],
  '{interruption}': ['投影仪坏了', '客户的CEO临时加入', '手机突然响了', '有人闯入会议室'],
  '{aspect1}': ['前端业务', '投资决策', '客户对接'],
  '{aspect2}': ['风险控制', '合规审查', '运营支持'],
  '{work}': ['项目进展', '风险评估', '客户方案'],
  '{outcome}': ['效率显著提升', '沟通更加顺畅', '问题得到解决', '建立了长效机制'],
  '{crisis_type}': ['系统故障', '数据泄露', '交易异常', '客户投诉'],
  '{scope}': ['全公司', '整个行业', '全球市场', '区域范围'],
  '{phase}': ['关键', '恢复', '善后', '总结'],
  '{lesson}': ['需要完善应急预案', '暴露了管理漏洞', '团队协作需要加强', '制度建设刻不容缓'],
  '{purpose}': ['建立关系', '推进合作', '交换信息', '寻求支持'],
  '{information}': ['公司即将进行重大调整', '有人在背后运作', '一个未公开的项目', '即将到来的审计'],
  '{quality}': ['专业素养', '独到见解', '人格魅力', '创新思维'],
  '{competition}': ['内部竞争', '晋升角逐', '项目争夺', '资源竞争'],
  '{situation}': ['形势紧张', '竞争激烈', '机会均等', '你略占优势'],
  '{performance_var}': ['出色表现', '失误', '创新方案', '人脉运作'],
  '{action_result_var}': ['抢了风头', '出了差错', '提出了建设性意见', '暗中使绊子'],
  '{decision}': ['推进项目', '暂缓执行', '调整方案', '重新评估'],
  '{resource_var}': ['更多资源', '额外人力', '技术支持', '时间宽限'],
  '{metric}': ['关键指标', '进度', '质量', '成本'],
  '{risk_var}': ['重大风险', '潜在问题', '合规隐患', '技术债务'],
  '{phase_var}': ['关键', '收尾', '启动', '攻坚'],
  '{compliance_risk_var}': ['合规隐患', '操作风险', '法律风险', '声誉风险'],
  '{regulation}': ['新监管规定', '行业准则', '国际标准', '内部制度'],
  '{practice_var}': ['业务操作', '客户管理', '信息披露', '风险控制'],
  '{skill}': ['财务建模', '市场分析', '风险管理', '客户沟通'],
  '{impact}': ['深远影响', '重大冲击', '微妙变化', '潜在机会'],
  '{impact_var}': ['直接影响', '间接影响', '短期影响', '长期影响'],
  '{crisis}': ['金融危机', '市场崩盘', '流动性危机', '信用危机'],
  '{opportunity_var}': ['新的业务机会', '市场空白', '政策红利', '技术突破'],
  '{threat}': ['竞争加剧', '监管收紧', '市场萎缩', '技术颠覆'],
  '{consequence}': ['影响深远', '需要重新规划', '引发了连锁反应', '改变了格局'],
  '{response}': ['迅速启动应急预案', '保持冷静分析局势', '第一时间上报', '先确保数据安全'],
  '{action_var}': ['立即整改', '深入调查', '加强监控', '完善制度'],
  '{negotiation}': ['价格谈判', '条款协商', '条件博弈', '利益分配'],
  '{compromise}': ['各让一步', '求同存异', '折中方案', '暂时搁置'],
  '{breakthrough_var}': ['关键突破', '重要进展', '实质性成果', '阶段性胜利'],
  '{setback}': ['重大挫折', '严重延误', '关键失败', '意外障碍'],
  '{revelation}': ['意外发现', '重要线索', '隐藏真相', '关键证据'],
  '{dilemma_var}': ['两难选择', '道德困境', '利益冲突', '原则考验'],
  '{resolution_var}': ['果断决策', '寻求帮助', '深思熟虑', '权衡利弊'],
  '{transformation}': ['业务转型', '组织变革', '技术升级', '战略调整'],
  '{innovation}': ['产品创新', '模式创新', '技术创新', '服务创新'],
  '{disruption}': ['行业颠覆', '市场洗牌', '格局重塑', '规则改变'],
  '{collaboration_var}': ['跨界合作', '战略联盟', '联合创新', '资源共享'],
  '{competition_var}': ['正面竞争', '差异化竞争', '错位竞争', '合作竞争'],
  '{growth}': ['高速增长', '稳健发展', '结构性增长', '创新驱动增长'],
  '{decline}': ['业绩下滑', '市场份额萎缩', '客户流失', '人才出走'],
  '{recovery}': ['触底反弹', '逐步恢复', 'V型反转', '缓慢复苏'],
  '{expansion}': ['业务扩张', '市场拓展', '规模增长', '版图扩大'],
  '{contraction}': ['业务收缩', '裁员降本', '战略收缩', '断臂求生'],
  '{consolidation}': ['行业整合', '并购重组', '优胜劣汰', '格局集中'],
  '{diversification}': ['多元化布局', '跨界拓展', '生态构建', '协同发展'],
  '{specialization}': ['专业化深耕', '聚焦核心', '打造壁垒', '精益求精'],
  '{digitalization}': ['数字化转型', '智能化升级', '线上化迁移', '数据驱动'],
  '{globalization}': ['国际化布局', '跨境业务', '全球配置', '出海战略'],
  '{localization}': ['本土化策略', '区域深耕', '社区运营', '下沉市场'],
  '{sustainability}': ['可持续发展', 'ESG实践', '绿色金融', '社会责任'],
  '{resilience}': ['韧性建设', '抗风险能力', '危机应对', '弹性运营'],
  '{efficiency}': ['效率提升', '流程优化', '自动化改造', '精益管理'],
  '{talent}': ['人才战略', '团队建设', '能力培养', '组织发展'],
  '{culture}': ['文化建设', '价值观塑造', '团队凝聚力', '创新氛围'],
  '{governance}': ['公司治理', '内控体系', '决策机制', '监督体系'],
  '{technology_var}': ['技术架构', '系统平台', '数据治理', '安全体系'],
  '{customer}': ['客户体验', '服务升级', '需求洞察', '价值创造'],
  '{ecosystem}': ['生态构建', '平台战略', '开放合作', '网络效应'],
  '{capital}': ['资本运作', '融资策略', '投资布局', '资金管理'],
  '{risk_management}': ['全面风险管理', '风控升级', '合规强化', '安全保障'],
  '{data}': ['数据资产', '数据治理', '数据安全', '数据价值'],
  '{ai}': ['AI应用', '智能决策', '算法优化', '模型迭代'],
  '{blockchain}': ['区块链应用', '去中心化', '智能合约', '数字资产'],
  '{cloud}': ['云原生', '弹性架构', '分布式系统', '微服务'],
  '{security}': ['信息安全', '隐私保护', '网络防御', '合规安全'],
  '{regulation_var}': ['监管科技', '合规科技', '监管沙盒', '穿透式监管'],
  '{fintech}': ['金融科技', '科技赋能', '数字金融', '智慧金融'],
  '{esg}': ['ESG投资', '绿色金融', '社会责任', '可持续发展'],
  '{wealth_management}': ['财富管理', '资产配置', '家族办公室', '全权委托'],
  '{investment_banking}': ['投资银行', '资本市场', '并购顾问', '融资服务'],
  '{asset_management}': ['资产管理', '主动管理', '被动投资', '另类投资'],
  '{insurance}': ['保险科技', '精算创新', '风险定价', '理赔自动化'],
  '{payment}': ['支付科技', '跨境支付', '数字货币', '清算结算'],
  '{lending}': ['信贷科技', '风控模型', '普惠金融', '供应链金融'],
  '{capital_market}': ['资本市场', '直接融资', '多层次市场', '市场基础设施'],
};

// ===== 场景生成 =====
export function generateSceneDescription(category: string): string {
  const templates = SCENE_TEMPLATES[category];
  if (!templates || templates.length === 0) {
    return '今天是一个普通的工作日。';
  }
  
  const template = randomFrom(templates);
  
  // 替换模板变量
  let result = template;
  const matches = result.match(/\{[^}]+\}/g) || [];
  
  for (const match of matches) {
    const varValues = TEMPLATE_VARS[match];
    if (varValues && varValues.length > 0) {
      result = result.replace(match, randomFrom(varValues));
    } else {
      // 如果没有匹配的变量值，移除占位符
      result = result.replace(match, '');
    }
  }
  
  return result;
}

// ===== 计算场景总数 =====
export function calculateTotalScenes(): number {
  let total = 0;
  
  for (const category of Object.keys(SCENE_TEMPLATES)) {
    const templates = SCENE_TEMPLATES[category];
    for (const template of templates) {
      const matches = template.match(/\{[^}]+\}/g) || [];
      let combinations = 1;
      for (const match of matches) {
        const varValues = TEMPLATE_VARS[match];
        if (varValues) {
          combinations *= varValues.length;
        }
      }
      total += combinations;
    }
  }
  
  return total;
}

// ===== 生成初始属性 =====
export function generateInitialAttributes(
  personality: string,
  skills: string[],
  careerDirection: string
): CharacterAttributes {
  const base: CharacterAttributes = {
    intelligence: 50 + randomInt(-10, 10),
    charisma: 50 + randomInt(-10, 10),
    resilience: 50 + randomInt(-10, 10),
    ethics: 50 + randomInt(-10, 10),
    ambition: 50 + randomInt(-10, 10),
    luck: 50 + randomInt(-10, 10),
    financialAcumen: 50 + randomInt(-10, 10),
    technicalSkill: 50 + randomInt(-10, 10),
    networkStrength: 50 + randomInt(-10, 10),
    leadership: 50 + randomInt(-10, 10),
    compliance: 50 + randomInt(-10, 10),
    health: 80 + randomInt(-5, 10),
    mentalHealth: 80 + randomInt(-5, 10),
    reputation: 50 + randomInt(-5, 5),
    wealth: 10 + randomInt(0, 20),
    stress: 20 + randomInt(0, 10),
    position: '分析师',
    company: randomFrom(COMPANY_TYPES),
    experience: 0,
    achievements: ['初入职场'],
    failures: [],
  };

  // 根据品格描述调整属性
  const personalityLower = personality.toLowerCase();
  if (personalityLower.includes('果断') || personalityLower.includes('决断')) {
    base.ambition += 10;
    base.leadership += 8;
  }
  if (personalityLower.includes('谨慎') || personalityLower.includes('保守')) {
    base.compliance += 10;
    base.resilience += 5;
  }
  if (personalityLower.includes('野心') || personalityLower.includes('激进')) {
    base.ambition += 15;
    base.ethics -= 5;
  }
  if (personalityLower.includes('沉稳') || personalityLower.includes('冷静')) {
    base.resilience += 10;
    base.intelligence += 5;
  }
  if (personalityLower.includes('圆滑') || personalityLower.includes('交际')) {
    base.charisma += 12;
    base.networkStrength += 10;
  }
  if (personalityLower.includes('正直') || personalityLower.includes('诚实')) {
    base.ethics += 15;
    base.reputation += 5;
  }
  if (personalityLower.includes('投机') || personalityLower.includes('冒险')) {
    base.luck += 10;
    base.ethics -= 8;
  }
  if (personalityLower.includes('隐忍') || personalityLower.includes('耐')) {
    base.resilience += 12;
    base.mentalHealth += 5;
  }
  if (personalityLower.includes('领导') || personalityLower.includes('管理')) {
    base.leadership += 12;
    base.charisma += 5;
  }
  if (personalityLower.includes('创新') || personalityLower.includes('创造')) {
    base.intelligence += 10;
    base.technicalSkill += 8;
  }
  if (personalityLower.includes('理性') || personalityLower.includes('算计')) {
    base.intelligence += 8;
    base.financialAcumen += 5;
  }
  if (personalityLower.includes('情义') || personalityLower.includes('忠诚')) {
    base.networkStrength += 10;
    base.ethics += 5;
  }

  // 根据技能调整
  for (const skill of skills) {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('建模') || skillLower.includes('量化')) {
      base.technicalSkill += 8;
      base.intelligence += 5;
    }
    if (skillLower.includes('估值') || skillLower.includes('分析')) {
      base.financialAcumen += 8;
    }
    if (skillLower.includes('风控') || skillLower.includes('合规')) {
      base.compliance += 10;
    }
    if (skillLower.includes('交易') || skillLower.includes('算法')) {
      base.technicalSkill += 8;
      base.luck += 3;
    }
    if (skillLower.includes('管理') || skillLower.includes('组合')) {
      base.leadership += 5;
      base.financialAcumen += 5;
    }
    if (skillLower.includes('并购') || skillLower.includes('ipo')) {
      base.financialAcumen += 8;
      base.networkStrength += 5;
    }
    if (skillLower.includes('机器') || skillLower.includes('数据')) {
      base.technicalSkill += 10;
      base.intelligence += 5;
    }
    if (skillLower.includes('区块链') || skillLower.includes('智能合约')) {
      base.technicalSkill += 10;
    }
    if (skillLower.includes('宏观') || skillLower.includes('行业')) {
      base.intelligence += 8;
      base.financialAcumen += 5;
    }
  }

  // 根据职业方向调整
  const careerLower = careerDirection.toLowerCase();
  if (careerLower.includes('投资银行') || careerLower.includes('投行')) {
    base.ambition += 10;
    base.stress += 15;
    base.networkStrength += 8;
  }
  if (careerLower.includes('量化') || careerLower.includes('算法')) {
    base.technicalSkill += 12;
    base.intelligence += 10;
  }
  if (careerLower.includes('基金') || careerLower.includes('资管')) {
    base.financialAcumen += 10;
  }
  if (careerLower.includes('风控') || careerLower.includes('合规')) {
    base.compliance += 12;
  }
  if (careerLower.includes('金融科技') || careerLower.includes('fintech')) {
    base.technicalSkill += 12;
    base.intelligence += 8;
  }

  // Clamp all values
  base.intelligence = clamp(base.intelligence, 10, 100);
  base.charisma = clamp(base.charisma, 10, 100);
  base.resilience = clamp(base.resilience, 10, 100);
  base.ethics = clamp(base.ethics, 10, 100);
  base.ambition = clamp(base.ambition, 10, 100);
  base.luck = clamp(base.luck, 10, 100);
  base.financialAcumen = clamp(base.financialAcumen, 10, 100);
  base.technicalSkill = clamp(base.technicalSkill, 10, 100);
  base.networkStrength = clamp(base.networkStrength, 10, 100);
  base.leadership = clamp(base.leadership, 10, 100);
  base.compliance = clamp(base.compliance, 10, 100);
  base.health = clamp(base.health, 10, 100);
  base.mentalHealth = clamp(base.mentalHealth, 10, 100);
  base.reputation = clamp(base.reputation, 10, 100);
  base.stress = clamp(base.stress, 0, 100);

  return base;
}

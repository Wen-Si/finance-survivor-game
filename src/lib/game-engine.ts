// ==========================================
// AI驱动的游戏模拟引擎
// 使用 z-ai-web-dev-sdk 让AI操控数字人
// ==========================================
import ZAI from 'z-ai-web-dev-sdk';
import {
  GameCharacter,
  GameEvent,
  SCENE_CATEGORIES,
  generateSceneDescription,
  randomFrom,
  randomInt,
  clamp,
  POSITION_LEVELS,
} from './game-data';

let zaiInstance: ZAI | null = null;
let zaiInitFailed = false;

async function getZAI(): Promise<ZAI | null> {
  if (zaiInitFailed) return null;
  try {
    if (!zaiInstance) {
      zaiInstance = await ZAI.create();
    }
    return zaiInstance;
  } catch (e) {
    console.error('[GameEngine] Failed to initialize ZAI:', e);
    zaiInitFailed = true;
    return null;
  }
}

// ===== AI生成角色决策 =====
export async function generateAIDecision(
  character: GameCharacter,
  sceneDescription: string,
  category: string
): Promise<{ decision: string; reasoning: string }> {
  const zai = await getZAI();
  
  // 如果AI不可用，使用规则引擎生成决策
  if (!zai) {
    return generateRuleBasedDecision(character, sceneDescription, category);
  }
  
  try {
    const prompt = `你是一个金融职场生存游戏中的AI角色控制器。你需要根据角色的性格、技能和当前状态，为角色在给定场景中做出最符合其人设的决策。

## 角色信息
- 姓名：${character.name}
- 品格描述：${character.personality}
- 专业技能：${character.skills.join('、')}
- 职业方向：${character.careerDirection}
- 背景：${character.background}
- 当前职位：${character.attributes.position}
- 所在公司：${character.attributes.company}
- 工作年限：${character.attributes.experience}年

## 角色当前属性
- 智慧：${character.attributes.intelligence}  魅力：${character.attributes.charisma}
- 韧性：${character.attributes.resilience}  道德：${character.attributes.ethics}
- 野心：${character.attributes.ambition}  运气：${character.attributes.luck}
- 金融敏锐度：${character.attributes.financialAcumen}  技术能力：${character.attributes.technicalSkill}
- 人脉网络：${character.attributes.networkStrength}  领导力：${character.attributes.leadership}
- 合规意识：${character.attributes.compliance}  健康状况：${character.attributes.health}
- 心理健康：${character.attributes.mentalHealth}  声誉：${character.attributes.reputation}
- 财富：${character.attributes.wealth}  压力：${character.attributes.stress}

## 当前场景（${category}）
${sceneDescription}

## 要求
1. 根据角色的品格和属性，做出最符合人设的决策
2. 决策要体现角色的专业能力和性格特点
3. 用2-3句话描述角色的决策和行动
4. 保持角色一致性

请直接输出角色的决策，不要加任何前缀或解释。`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: '你是一个金融职场生存游戏的AI角色控制器，负责为游戏中的数字人角色做出符合其人设的决策。输出简洁的决策描述。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const decision = completion.choices[0]?.message?.content?.trim() || '谨慎观察，等待更多信息后再做决定。';
    return { decision, reasoning: 'AI基于角色人设生成' };
  } catch (e) {
    console.error('[GameEngine] AI decision generation failed:', e);
    return generateRuleBasedDecision(character, sceneDescription, category);
  }
}

// ===== 规则引擎决策（AI不可用时的备选方案） =====
function generateRuleBasedDecision(
  character: GameCharacter,
  sceneDescription: string,
  category: string
): { decision: string; reasoning: string } {
  const { attributes, personality, skills } = character;
  
  const decisions: Record<string, string[]> = {
    '日常办公': [
      attributes.ambition > 60 ? `${character.name}主动承担了额外的工作任务，展现出强烈的进取心。` : `${character.name}按部就班完成了日常工作，确保不出差错。`,
      attributes.technicalSkill > 60 ? `${character.name}利用专业技能优化了工作流程，提高了效率。` : `${character.name}认真完成了分配的任务，并做了详细记录。`,
      attributes.leadership > 50 ? `${character.name}组织团队讨论，协调了多项工作进度。` : `${character.name}专注于自己的工作，保持了高效产出。`,
    ],
    '客户会议': [
      attributes.charisma > 60 ? `${character.name}凭借出色的沟通能力，成功说服了客户接受方案。` : `${character.name}准备了详尽的数据报告，用专业性打动了客户。`,
      attributes.financialAcumen > 60 ? `${character.name}在会议中展示了精准的市场分析，赢得了客户信任。` : `${character.name}认真记录了客户需求，承诺后续跟进。`,
    ],
    '项目汇报': [
      attributes.intelligence > 60 ? `${character.name}用数据支撑的汇报获得了领导认可。` : `${character.name}认真准备了汇报材料，条理清晰地完成了展示。`,
      attributes.networkStrength > 50 ? `${character.name}在汇报中巧妙地引用了团队成员的贡献，展现了领导力。` : `${character.name}专注于自己的部分，确保汇报内容准确无误。`,
    ],
    '危机处理': [
      attributes.resilience > 60 ? `${character.name}冷静分析局势，迅速制定了应对方案。` : `${character.name}按照应急预案执行，同时寻求上级指导。`,
      attributes.technicalSkill > 50 ? `${character.name}利用技术手段快速定位问题根源，提出了解决方案。` : `${character.name}及时上报问题，配合团队共同应对。`,
    ],
    '社交应酬': [
      attributes.charisma > 50 ? `${character.name}在社交场合游刃有余，拓展了人脉关系。` : `${character.name}保持了适度的社交，与几位同行交换了联系方式。`,
      attributes.networkStrength > 50 ? `${character.name}通过社交活动加强了与关键人物的联系。` : `${character.name}在社交中保持了专业形象，不过分亲近。`,
    ],
    '内部竞争': [
      attributes.ambition > 60 ? `${character.name}积极争取机会，展现出强烈的竞争意识。` : `${character.name}保持低调，用实力说话。`,
      attributes.ethics > 60 ? `${character.name}坚持公平竞争，拒绝不正当手段。` : `${character.name}在竞争中采取策略，但保持在规则之内。`,
    ],
    '行业峰会': [
      attributes.networkStrength > 50 ? `${character.name}在峰会上积极交流，建立了多个有价值的行业联系。` : `${character.name}认真听取了行业前沿观点，做了详细笔记。`,
      attributes.intelligence > 60 ? `${character.name}在讨论环节提出了独到见解，引起关注。` : `${character.name}低调学习，吸收行业最新动态。`,
    ],
    '监管审查': [
      attributes.compliance > 60 ? `${character.name}积极配合审查，展示了完善的合规体系。` : `${character.name}谨慎应对审查，确保不出现纰漏。`,
      attributes.ethics > 50 ? `${character.name}坦诚面对问题，主动提供所需资料。` : `${character.name}在合规范围内尽量减少信息暴露。`,
    ],
    '市场波动': [
      attributes.financialAcumen > 60 ? `${character.name}准确判断市场走势，及时调整策略。` : `${character.name}保持谨慎，减少风险敞口。`,
      attributes.luck > 60 ? `${character.name}在波动中发现了机会，果断出手。` : `${character.name}选择观望，等待市场明朗。`,
    ],
    '人事变动': [
      attributes.networkStrength > 50 ? `${character.name}迅速与新领导建立良好关系。` : `${character.name}保持专业态度，适应新的管理风格。`,
      attributes.leadership > 50 ? `${character.name}主动承担更多责任，展现领导潜力。` : `${character.name}专注于本职工作，确保不受影响。`,
    ],
    '业务拓展': [
      attributes.charisma > 50 ? `${character.name}主动出击，成功开拓了新客户。` : `${character.name}通过专业能力吸引客户，稳步拓展业务。`,
      attributes.ambition > 60 ? `${character.name}大胆提出创新业务方案，争取资源支持。` : `${character.name}在现有业务基础上稳步扩展。`,
    ],
    '合规挑战': [
      attributes.compliance > 60 ? `${character.name}坚持合规底线，拒绝违规操作。` : `${character.name}在灰色地带谨慎行事，寻求合规建议。`,
      attributes.ethics > 60 ? `${character.name}坚守职业道德，即使面临压力也不妥协。` : `${character.name}权衡利弊后选择了相对安全的方案。`,
    ],
    '技术革新': [
      attributes.technicalSkill > 60 ? `${character.name}快速掌握新技术，应用于实际工作。` : `${character.name}积极学习新技术，参加培训。`,
      attributes.intelligence > 60 ? `${character.name}洞察技术趋势，提出前瞻性建议。` : `${character.name}跟随团队步伐，逐步适应技术变化。`,
    ],
    '团队管理': [
      attributes.leadership > 60 ? `${character.name}有效激励团队，提升了整体绩效。` : `${character.name}以身作则，用行动影响团队。`,
      attributes.charisma > 50 ? `${character.name}通过沟通化解团队矛盾，增强凝聚力。` : `${character.name}制定明确规则，确保团队有序运作。`,
    ],
    '跨部门协作': [
      attributes.networkStrength > 50 ? `${character.name}利用人脉关系推动跨部门合作。` : `${character.name}按照流程推进协作，确保信息透明。`,
      attributes.charisma > 50 ? `${character.name}通过良好沟通化解了部门间的分歧。` : `${character.name}提供专业支持，赢得其他部门信任。`,
    ],
    '职业抉择': [
      attributes.ambition > 60 ? `${character.name}选择了更具挑战性的机会，追求更高发展。` : `${character.name}权衡利弊后选择了稳定的路径。`,
      attributes.resilience > 60 ? `${character.name}勇敢接受新挑战，不惧不确定性。` : `${character.name}谨慎评估后做出了保守选择。`,
    ],
    '道德困境': [
      attributes.ethics > 60 ? `${character.name}坚守道德底线，拒绝了不当要求。` : `${character.name}在压力下做出了妥协，但内心不安。`,
      personality.includes('正直') ? `${character.name}坚持原则，即使可能影响短期利益。` : `${character.name}在道德与利益之间寻找平衡点。`,
    ],
    '投资决策': [
      attributes.financialAcumen > 60 ? `${character.name}基于深入分析做出了精准的投资判断。` : `${character.name}参考专业意见，做出了谨慎的投资选择。`,
      attributes.luck > 60 ? `${character.name}凭借敏锐直觉抓住了投资机会。` : `${character.name}分散投资，控制风险。`,
    ],
    '风险事件': [
      attributes.resilience > 60 ? `${character.name}沉着应对风险，迅速启动应急预案。` : `${character.name}第一时间上报风险，寻求支持。`,
      attributes.technicalSkill > 50 ? `${character.name}利用技术手段量化风险，制定对冲策略。` : `${character.name}按照风控流程处理，确保损失可控。`,
    ],
    '晋升考核': [
      attributes.ambition > 60 ? `${character.name}充分展示业绩，积极争取晋升机会。` : `${character.name}踏实工作，用成绩说话。`,
      attributes.leadership > 50 ? `${character.name}展现了出色的领导才能和团队管理能力。` : `${character.name}以专业深度赢得了考核官的认可。`,
    ],
  };
  
  const categoryDecisions = decisions[category] || [
    `${character.name}根据自身判断做出了决策，展现了${randomFrom(['专业', '谨慎', '果断', '沉稳'])}的作风。`,
    `${character.name}运用${randomFrom(skills.length > 0 ? skills : ['金融分析'])}技能应对了当前局面。`,
  ];
  
  const decision = randomFrom(categoryDecisions);
  return { decision, reasoning: '规则引擎基于角色属性生成' };
}

// ===== AI生成后果 =====
async function generateAIConsequence(
  character: GameCharacter,
  sceneDescription: string,
  decision: string,
  category: string
): Promise<{ consequence: string; attributeChanges: Record<string, number> }> {
  const zai = await getZAI();
  
  if (!zai) {
    return generateRuleBasedConsequence(character, decision, category);
  }
  
  try {
    const prompt = `你是金融职场生存游戏的后果生成器。根据角色在场景中的决策，生成合理的后果和属性变化。

## 角色信息
- 姓名：${character.name}
- 品格：${character.personality}
- 职位：${character.attributes.position}
- 压力：${character.attributes.stress}  声誉：${character.attributes.reputation}
- 财富：${character.attributes.wealth}  健康：${character.attributes.health}

## 场景
${sceneDescription}

## 角色决策
${decision}

## 要求
1. 生成2-3句后果描述
2. 列出属性变化（-10到+10之间的整数）
3. 可变化的属性：intelligence, charisma, resilience, ethics, ambition, luck, financialAcumen, technicalSkill, networkStrength, leadership, compliance, health, mentalHealth, reputation, wealth, stress

请用以下JSON格式输出：
{"consequence":"后果描述","attributeChanges":{"属性名":变化值}}

只输出JSON，不要其他内容。`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: '你是金融职场生存游戏的后果生成器。只输出JSON格式的后果和属性变化。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '';
    
    // 尝试解析JSON
    try {
      // 提取JSON部分（可能被markdown代码块包裹）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        // 验证属性变化值范围
        const changes: Record<string, number> = {};
        for (const [key, value] of Object.entries(result.attributeChanges || {})) {
          if (typeof value === 'number') {
            changes[key] = Math.max(-10, Math.min(10, value));
          }
        }
        return {
          consequence: result.consequence || '事情按预期发展。',
          attributeChanges: changes,
        };
      }
    } catch {
      // JSON解析失败，使用规则引擎
    }
    
    return generateRuleBasedConsequence(character, decision, category);
  } catch (e) {
    console.error('[GameEngine] AI consequence generation failed:', e);
    return generateRuleBasedConsequence(character, decision, category);
  }
}

// ===== 规则引擎后果 =====
function generateRuleBasedConsequence(
  character: GameCharacter,
  decision: string,
  category: string
): { consequence: string; attributeChanges: Record<string, number> } {
  const changes: Record<string, number> = {};
  const { attributes } = character;
  
  // 基于场景类别和角色属性生成后果
  const luck = attributes.luck + randomInt(-20, 20);
  const success = luck > 40;
  
  switch (category) {
    case '日常办公':
      if (success) {
        changes.technicalSkill = randomInt(1, 3);
        changes.reputation = randomInt(0, 2);
        changes.stress = randomInt(0, 2);
      } else {
        changes.stress = randomInt(1, 4);
        changes.mentalHealth = randomInt(-2, 0);
      }
      break;
    case '客户会议':
      if (success) {
        changes.networkStrength = randomInt(1, 4);
        changes.reputation = randomInt(1, 3);
        changes.wealth = randomInt(1, 5);
      } else {
        changes.reputation = randomInt(-3, -1);
        changes.stress = randomInt(2, 5);
      }
      break;
    case '项目汇报':
      if (success) {
        changes.reputation = randomInt(2, 5);
        changes.leadership = randomInt(1, 3);
      } else {
        changes.reputation = randomInt(-3, -1);
        changes.stress = randomInt(2, 4);
      }
      break;
    case '危机处理':
      if (success) {
        changes.resilience = randomInt(2, 5);
        changes.reputation = randomInt(3, 6);
        changes.leadership = randomInt(1, 4);
      } else {
        changes.reputation = randomInt(-5, -2);
        changes.stress = randomInt(5, 10);
        changes.mentalHealth = randomInt(-5, -2);
      }
      break;
    case '社交应酬':
      if (success) {
        changes.networkStrength = randomInt(2, 5);
        changes.charisma = randomInt(1, 3);
      } else {
        changes.wealth = randomInt(-3, -1);
        changes.health = randomInt(-2, 0);
      }
      break;
    case '内部竞争':
      if (success) {
        changes.ambition = randomInt(1, 3);
        changes.reputation = randomInt(1, 4);
      } else {
        changes.stress = randomInt(3, 7);
        changes.mentalHealth = randomInt(-3, -1);
      }
      break;
    case '行业峰会':
      if (success) {
        changes.networkStrength = randomInt(3, 6);
        changes.intelligence = randomInt(1, 3);
        changes.reputation = randomInt(1, 3);
      } else {
        changes.wealth = randomInt(-2, 0);
      }
      break;
    case '监管审查':
      if (success) {
        changes.compliance = randomInt(2, 5);
        changes.reputation = randomInt(1, 3);
      } else {
        changes.reputation = randomInt(-6, -2);
        changes.compliance = randomInt(-3, -1);
        changes.stress = randomInt(5, 10);
      }
      break;
    case '市场波动':
      if (success) {
        changes.financialAcumen = randomInt(2, 5);
        changes.wealth = randomInt(3, 8);
      } else {
        changes.wealth = randomInt(-8, -3);
        changes.stress = randomInt(3, 8);
      }
      break;
    case '人事变动':
      if (success) {
        changes.networkStrength = randomInt(1, 4);
        changes.leadership = randomInt(1, 3);
      } else {
        changes.stress = randomInt(3, 6);
        changes.mentalHealth = randomInt(-3, -1);
      }
      break;
    case '业务拓展':
      if (success) {
        changes.wealth = randomInt(3, 7);
        changes.reputation = randomInt(2, 4);
        changes.networkStrength = randomInt(1, 3);
      } else {
        changes.wealth = randomInt(-4, -1);
        changes.stress = randomInt(2, 5);
      }
      break;
    case '合规挑战':
      if (success) {
        changes.compliance = randomInt(3, 6);
        changes.ethics = randomInt(2, 4);
        changes.reputation = randomInt(1, 3);
      } else {
        changes.reputation = randomInt(-5, -2);
        changes.compliance = randomInt(-4, -1);
        changes.stress = randomInt(4, 8);
      }
      break;
    case '技术革新':
      if (success) {
        changes.technicalSkill = randomInt(3, 6);
        changes.intelligence = randomInt(1, 3);
      } else {
        changes.stress = randomInt(2, 4);
      }
      break;
    case '团队管理':
      if (success) {
        changes.leadership = randomInt(2, 5);
        changes.charisma = randomInt(1, 3);
        changes.reputation = randomInt(1, 3);
      } else {
        changes.stress = randomInt(3, 6);
        changes.reputation = randomInt(-2, 0);
      }
      break;
    case '跨部门协作':
      if (success) {
        changes.networkStrength = randomInt(2, 4);
        changes.leadership = randomInt(1, 3);
      } else {
        changes.stress = randomInt(2, 5);
      }
      break;
    case '职业抉择':
      if (success) {
        changes.ambition = randomInt(2, 5);
        changes.wealth = randomInt(2, 6);
        changes.reputation = randomInt(1, 3);
      } else {
        changes.stress = randomInt(4, 8);
        changes.mentalHealth = randomInt(-4, -1);
      }
      break;
    case '道德困境':
      if (attributes.ethics > 60) {
        changes.ethics = randomInt(2, 4);
        changes.reputation = randomInt(1, 3);
        changes.wealth = randomInt(-3, 0);
      } else {
        changes.wealth = randomInt(1, 5);
        changes.ethics = randomInt(-4, -1);
        changes.reputation = randomInt(-3, 0);
      }
      break;
    case '投资决策':
      if (success) {
        changes.wealth = randomInt(4, 10);
        changes.financialAcumen = randomInt(1, 4);
      } else {
        changes.wealth = randomInt(-10, -3);
        changes.stress = randomInt(4, 8);
      }
      break;
    case '风险事件':
      if (success) {
        changes.resilience = randomInt(3, 6);
        changes.reputation = randomInt(2, 4);
      } else {
        changes.wealth = randomInt(-8, -3);
        changes.reputation = randomInt(-4, -1);
        changes.stress = randomInt(5, 10);
        changes.mentalHealth = randomInt(-5, -2);
      }
      break;
    case '晋升考核':
      if (success) {
        changes.reputation = randomInt(3, 6);
        changes.leadership = randomInt(2, 4);
        changes.wealth = randomInt(2, 5);
      } else {
        changes.stress = randomInt(4, 8);
        changes.mentalHealth = randomInt(-3, -1);
      }
      break;
    default:
      changes.stress = randomInt(0, 3);
      changes.reputation = randomInt(-1, 2);
  }
  
  // 通用变化
  changes.experience = 1;
  if (!changes.stress) changes.stress = randomInt(0, 3);
  if (!changes.health) changes.health = randomInt(-1, 1);
  if (!changes.mentalHealth) changes.mentalHealth = randomInt(-1, 1);
  
  // 生成后果描述
  const consequenceTemplates = success ? [
    `${character.name}的决策取得了良好效果，${randomFrom(['获得了同事的认可', '赢得了领导的赞赏', '提升了自身影响力', '为后续发展奠定了基础'])}。`,
    `这次经历让${character.name}受益匪浅，${randomFrom(['专业能力得到了锻炼', '人脉关系进一步拓展', '在行业内的知名度有所提升', '对业务有了更深的理解'])}。`,
    `${character.name}抓住了机会，${randomFrom(['成功化解了难题', '展现了出色的判断力', '赢得了关键人物的信任', '为公司创造了价值'])}。`,
  ] : [
    `${character.name}遇到了一些挫折，${randomFrom(['但从中吸取了教训', '需要重新调整策略', '承受了一定的压力', '但并未动摇决心'])}。`,
    `事情没有完全按计划进行，${character.name}${randomFrom(['需要寻找新的突破口', '暂时选择了退守', '开始反思自己的不足', '决定更加谨慎行事'])}。`,
    `这次的结果不尽如人意，${randomFrom(['但积累了宝贵经验', '让${character.name}更加警觉', '暴露了一些需要改进的地方', '但仍在可控范围内'])}。`,
  ];
  
  const consequence = randomFrom(consequenceTemplates);
  
  return { consequence, attributeChanges: changes };
}

// ===== 检查晋升 =====
function checkPromotion(character: GameCharacter): string | null {
  const { attributes, currentDay } = character;
  const currentIndex = POSITION_LEVELS.indexOf(attributes.position as typeof POSITION_LEVELS[number]);
  if (currentIndex < 0 || currentIndex >= POSITION_LEVELS.length - 1) return null;
  
  // 晋升条件：经验+声誉+领导力+运气
  const promotionChance = 
    (attributes.experience * 2 + attributes.reputation + attributes.leadership * 2 + attributes.ambition) / 10;
  
  // 每30天检查一次晋升机会
  if (currentDay % 30 !== 0 && currentDay > 0) return null;
  
  if (promotionChance > 60 + currentIndex * 15 && randomInt(1, 100) < 40) {
    const newPosition = POSITION_LEVELS[currentIndex + 1];
    attributes.position = newPosition;
    return newPosition;
  }
  
  return null;
}

// ===== 检查成就 =====
function checkAchievements(character: GameCharacter): string[] {
  const newAchievements: string[] = [];
  const { attributes, currentDay } = character;
  
  // 基于条件检查成就
  const achievementChecks: Array<{ name: string; condition: boolean }> = [
    { name: '初入职场', condition: currentDay >= 1 },
    { name: '第一桶金', condition: attributes.wealth >= 100 },
    { name: '人脉达人', condition: attributes.networkStrength >= 80 },
    { name: '技术专家', condition: attributes.technicalSkill >= 90 },
    { name: '管理新星', condition: attributes.leadership >= 70 },
    { name: '危机化解者', condition: attributes.resilience >= 85 },
    { name: '业绩冠军', condition: attributes.financialAcumen >= 90 },
    { name: '合规标兵', condition: attributes.compliance >= 90 },
    { name: '创新先锋', condition: attributes.intelligence >= 85 && attributes.technicalSkill >= 70 },
    { name: '团队领袖', condition: attributes.leadership >= 90 },
    { name: '百万交易', condition: attributes.wealth >= 500 },
    { name: '千万项目', condition: attributes.wealth >= 1000 },
    { name: '行业认可', condition: attributes.reputation >= 90 },
    { name: '客户信赖', condition: attributes.charisma >= 85 && attributes.reputation >= 75 },
    { name: '内部晋升', condition: ['经理', '高级经理', '总监', '副总裁', '高级副总裁', '执行副总裁', '合伙人', '董事总经理', '首席官'].includes(attributes.position) },
    { name: '逆风翻盘', condition: attributes.resilience >= 90 && attributes.stress < 30 },
    { name: '稳如泰山', condition: attributes.stress <= 10 && currentDay >= 50 },
    { name: '金融精英', condition: attributes.financialAcumen >= 90 && attributes.reputation >= 80 },
    { name: '职场老手', condition: currentDay >= 365 },
    { name: '传奇人物', condition: currentDay >= 1000 && attributes.reputation >= 90 },
    { name: '风控大师', condition: attributes.compliance >= 95 },
    { name: '投资圣手', condition: attributes.financialAcumen >= 95 && attributes.luck >= 70 },
    { name: '谈判专家', condition: attributes.charisma >= 90 && attributes.intelligence >= 80 },
    { name: '战略眼光', condition: attributes.intelligence >= 90 && attributes.ambition >= 80 },
    { name: '道德楷模', condition: attributes.ethics >= 95 },
  ];
  
  for (const check of achievementChecks) {
    if (attributes.achievements.includes(check.name)) continue;
    if (check.condition) {
      newAchievements.push(check.name);
      attributes.achievements.push(check.name);
    }
  }
  
  return newAchievements;
}

// ===== 检查游戏结束 =====
function checkGameOver(character: GameCharacter): { reason: string } | null {
  const { attributes } = character;
  
  // 检查游戏结束条件
  if (attributes.health <= 5) {
    return { reason: '身体崩溃，不得不退出职场' };
  }
  if (attributes.mentalHealth <= 5) {
    return { reason: '精神状态严重恶化，无法继续工作' };
  }
  if (attributes.reputation <= 5) {
    return { reason: '声誉彻底崩塌，被行业封杀' };
  }
  if (attributes.wealth <= -100) {
    return { reason: '负债累累，宣告破产' };
  }
  if (attributes.compliance <= 5) {
    return { reason: '严重违规，被吊销从业资格' };
  }
  if (attributes.stress >= 100) {
    return { reason: '压力过大，职业倦怠，选择退出' };
  }
  
  return null;
}

// ===== 模拟一天 =====
export async function simulateDay(character: GameCharacter): Promise<GameEvent> {
  // 1. 增加天数
  character.currentDay += 1;
  
  // 2. 选择场景类别
  const category = randomFrom(SCENE_CATEGORIES);
  
  // 3. 生成场景描述
  const sceneDescription = generateSceneDescription(category);
  
  // 4. AI生成决策
  const { decision } = await generateAIDecision(character, sceneDescription, category);
  
  // 5. AI生成后果
  const { consequence, attributeChanges } = await generateAIConsequence(character, sceneDescription, decision, category);
  
  // 6. 应用属性变化
  for (const [key, value] of Object.entries(attributeChanges)) {
    const attrRecord = character.attributes as unknown as Record<string, number | string | string[]>;
    if (key in character.attributes && typeof attrRecord[key] === 'number') {
      attrRecord[key] = clamp(
        (attrRecord[key] as number) + value,
        key === 'stress' ? 0 : 5,
        100
      );
    }
  }
  
  // 7. 经验增长
  character.attributes.experience = Math.round(character.attributes.experience * 10 + 1) / 10;
  
  // 8. 检查晋升
  const promotion = checkPromotion(character);
  
  // 9. 检查成就
  const newAchievements = checkAchievements(character);
  
  // 10. 检查游戏结束
  const gameOver = checkGameOver(character);
  if (gameOver) {
    character.isAlive = false;
    character.attributes.failures.push(gameOver.reason);
  }
  
  // 11. 压力自然恢复
  if (character.attributes.stress > 20) {
    character.attributes.stress = clamp(character.attributes.stress - 1, 0, 100);
  }
  
  // 12. 健康自然恢复（如果压力不高）
  if (character.attributes.stress < 40 && character.attributes.health < 80) {
    character.attributes.health = clamp(character.attributes.health + 1, 0, 100);
  }
  
  // 13. 更新时间戳
  character.lastSimulated = Date.now();
  
  // 14. 生成事件
  const event: GameEvent = {
    id: `evt_${character.currentDay}_${Date.now()}`,
    day: character.currentDay,
    category,
    title: `[第${character.currentDay}天] ${category}`,
    description: sceneDescription,
    aiDecision: decision,
    consequence: consequence + 
      (promotion ? ` 恭喜晋升为${promotion}！` : '') + 
      (newAchievements.length > 0 ? ` 获得成就：${newAchievements.join('、')}！` : '') + 
      (gameOver ? ` ${gameOver.reason}` : ''),
    attributeChanges,
    timestamp: Date.now(),
  };
  
  character.events.push(event);
  
  return event;
}

// ===== 批量模拟 =====
export async function simulateMultipleDays(
  character: GameCharacter,
  days: number
): Promise<GameEvent[]> {
  const events: GameEvent[] = [];
  
  for (let i = 0; i < days; i++) {
    if (!character.isAlive) break;
    const event = await simulateDay(character);
    events.push(event);
  }
  
  return events;
}

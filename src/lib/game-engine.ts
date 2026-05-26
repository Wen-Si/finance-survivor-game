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
  ACHIEVEMENTS,
  GAME_OVER_REASONS,
} from './game-data';

let zaiInstance: ZAI | null = null;

async function getZAI(): Promise<ZAI> {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ===== AI生成角色决策 =====
export async function generateAIDecision(
  character: GameCharacter,
  sceneDescription: string,
  category: string
): Promise<{ decision: string; reasoning: string }> {
  try {
    const zai = await getZAI();
    
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
- 合规意识：${character.attributes.compliance}  健康：${character.attributes.health}
- 心理健康：${character.attributes.mentalHealth}  声誉：${character.attributes.reputation}
- 财富：${character.attributes.wealth}  压力：${character.attributes.stress}

## 当前场景
类别：${category}
描述：${sceneDescription}

## 要求
1. 决策必须完全符合角色的品格和性格特点
2. 决策要考虑角色当前的技能水平和资源
3. 用2-3句话描述角色的决策行动
4. 用1-2句话解释为什么这个决策符合角色人设

请以JSON格式回复：
{"decision": "角色的决策行动", "reasoning": "决策理由"}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个金融职场生存游戏的AI角色控制器。你只需要返回JSON格式的决策结果，不要添加任何其他文字。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // 尝试解析JSON
    try {
      // 提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          decision: parsed.decision || '角色选择谨慎观察，暂不采取行动。',
          reasoning: parsed.reasoning || '基于当前情况做出的判断。',
        };
      }
    } catch {
      // JSON解析失败，使用原始内容
    }
    
    return {
      decision: content.slice(0, 200) || '角色选择谨慎观察，暂不采取行动。',
      reasoning: '基于角色性格和当前情况做出的判断。',
    };
  } catch (error) {
    console.error('[GameEngine] AI decision error:', error);
    // 降级：基于属性生成简单决策
    return generateFallbackDecision(character, category);
  }
}

// ===== 降级决策（AI不可用时） =====
function generateFallbackDecision(character: GameCharacter, category: string): { decision: string; reasoning: string } {
  const decisions: Record<string, string[]> = {
    '日常办公': [
      `${character.name}认真完成了今天的工作任务，并主动帮助同事解决问题。`,
      `${character.name}高效处理了手头的文件，提前完成了工作。`,
      `${character.name}仔细核对了数据，发现了一个重要细节。`,
    ],
    '客户会议': [
      `${character.name}在会议中展现了专业素养，赢得了客户的认可。`,
      `${character.name}巧妙地回应了客户的质疑，维护了公司形象。`,
      `${character.name}根据客户需求提出了创新方案。`,
    ],
    '危机处理': [
      `${character.name}冷静分析局势，制定了应对方案。`,
      `${character.name}迅速启动应急预案，控制了事态发展。`,
      `${character.name}协调各方资源，有效化解了危机。`,
    ],
    '社交应酬': [
      `${character.name}在社交场合展现了个人魅力，建立了新的人脉关系。`,
      `${character.name}与行业前辈深入交流，获得了宝贵建议。`,
    ],
    '晋升考核': [
      `${character.name}认真准备了考核材料，展示了工作成果。`,
      `${character.name}在考核中表现出色，获得了领导认可。`,
    ],
  };
  
  const categoryDecisions = decisions[category] || [`${character.name}根据当前情况做出了审慎的决定。`];
  
  return {
    decision: randomFrom(categoryDecisions),
    reasoning: `基于${character.name}的${character.personality}性格特点做出的判断。`,
  };
}

// ===== AI生成事件后果 =====
export async function generateAIConsequence(
  character: GameCharacter,
  sceneDescription: string,
  decision: string,
  category: string
): Promise<{ consequence: string; attributeChanges: Record<string, number> }> {
  try {
    const zai = await getZAI();
    
    const prompt = `你是金融职场生存游戏的事件后果生成器。根据角色在场景中的决策，生成合理的后果和属性变化。

## 角色信息
- 姓名：${character.name}  职位：${character.attributes.position}
- 品格：${character.personality}
- 智慧：${character.attributes.intelligence}  魅力：${character.attributes.charisma}
- 韧性：${character.attributes.resilience}  道德：${character.attributes.ethics}
- 野心：${character.attributes.ambition}  运气：${character.attributes.luck}
- 金融敏锐度：${character.attributes.financialAcumen}  技术能力：${character.attributes.technicalSkill}
- 人脉：${character.attributes.networkStrength}  领导力：${character.attributes.leadership}
- 合规：${character.attributes.compliance}  健康：${character.attributes.health}
- 心理健康：${character.attributes.mentalHealth}  声誉：${character.attributes.reputation}
- 财富：${character.attributes.wealth}  压力：${character.attributes.stress}

## 场景
${sceneDescription}

## 角色决策
${decision}

## 要求
1. 用2-3句话描述决策带来的后果
2. 给出属性变化（-10到+10之间的整数，大部分变化应在-3到+3之间）
3. 后果要合理，考虑角色属性和决策的匹配度
4. 可变属性：intelligence, charisma, resilience, ethics, ambition, luck, financialAcumen, technicalSkill, networkStrength, leadership, compliance, health, mentalHealth, reputation, wealth, stress

请以JSON格式回复：
{"consequence": "后果描述", "attributeChanges": {"属性名": 变化值}}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是金融职场生存游戏的事件后果生成器。只返回JSON格式结果。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const attributeChanges: Record<string, number> = {};
        
        // 验证并限制属性变化范围
        const validAttrs = [
          'intelligence', 'charisma', 'resilience', 'ethics', 'ambition', 'luck',
          'financialAcumen', 'technicalSkill', 'networkStrength', 'leadership',
          'compliance', 'health', 'mentalHealth', 'reputation', 'wealth', 'stress',
        ];
        
        for (const [key, value] of Object.entries(parsed.attributeChanges || {})) {
          if (validAttrs.includes(key) && typeof value === 'number') {
            attributeChanges[key] = clamp(value, -10, 10);
          }
        }
        
        return {
          consequence: parsed.consequence || '事情平稳发展。',
          attributeChanges,
        };
      }
    } catch {
      // JSON解析失败
    }
    
    return generateFallbackConsequence(character, category);
  } catch (error) {
    console.error('[GameEngine] AI consequence error:', error);
    return generateFallbackConsequence(character, category);
  }
}

// ===== 降级后果生成 =====
function generateFallbackConsequence(character: GameCharacter, category: string): { consequence: string; attributeChanges: Record<string, number> } {
  const consequences: Record<string, { consequence: string; attributeChanges: Record<string, number> }> = {
    '日常办公': {
      consequence: '工作顺利完成，获得了一些经验。',
      attributeChanges: { technicalSkill: 1, stress: 1 },
    },
    '客户会议': {
      consequence: '与客户的沟通有所收获。',
      attributeChanges: { charisma: 1, networkStrength: 1 },
    },
    '危机处理': {
      consequence: '危机得到了一定程度的控制。',
      attributeChanges: { resilience: 2, stress: 3 },
    },
    '社交应酬': {
      consequence: '拓展了一些人脉关系。',
      attributeChanges: { networkStrength: 2, health: -1 },
    },
    '晋升考核': {
      consequence: '考核结果符合预期。',
      attributeChanges: { reputation: 1, stress: 2 },
    },
  };
  
  const result = consequences[category] || {
    consequence: '事情按预期发展。',
    attributeChanges: { stress: 1 },
  };
  
  // 添加随机性
  const randomAttr = randomFrom(['intelligence', 'charisma', 'luck', 'financialAcumen'] as const);
  result.attributeChanges[randomAttr] = randomInt(-2, 2);
  
  return result;
}

// ===== 检查晋升条件 =====
function checkPromotion(character: GameCharacter): string | null {
  const { position, experience, leadership, reputation, financialAcumen, networkStrength } = character.attributes;
  const currentIndex = POSITION_LEVELS.indexOf(position as typeof POSITION_LEVELS[number]);
  
  if (currentIndex < 0 || currentIndex >= POSITION_LEVELS.length - 1) return null;
  
  // 晋升条件：经验 + 综合属性
  const promotionChance = 
    (experience > (currentIndex + 1) * 30 ? 20 : 0) +
    (leadership > 60 ? 15 : 0) +
    (reputation > 60 ? 15 : 0) +
    (financialAcumen > 50 ? 10 : 0) +
    (networkStrength > 50 ? 10 : 0) +
    (character.attributes.luck > 70 ? 10 : 0);
  
  if (randomInt(1, 100) <= promotionChance) {
    return POSITION_LEVELS[currentIndex + 1];
  }
  
  return null;
}

// ===== 检查游戏结束 =====
function checkGameOver(character: GameCharacter): { reason: string } | null {
  for (const condition of GAME_OVER_REASONS) {
    const attrValue = character.attributes[condition.condition as keyof typeof character.attributes];
    if (typeof attrValue === 'number' && attrValue <= condition.threshold) {
      return { reason: condition.reason };
    }
  }
  return null;
}

// ===== 模拟一天 =====
export async function simulateDay(character: GameCharacter): Promise<GameEvent> {
  // 1. 选择场景类别
  const category = randomFrom([...SCENE_CATEGORIES]);
  
  // 2. 生成场景描述
  const sceneDescription = generateSceneDescription(category);
  
  // 3. AI生成决策
  const { decision } = await generateAIDecision(character, sceneDescription, category);
  
  // 4. AI生成后果
  const { consequence, attributeChanges } = await generateAIConsequence(character, sceneDescription, decision, category);
  
  // 5. 应用属性变化
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
  
  // 6. 增加经验
  character.attributes.experience += 1;
  character.currentDay += 1;
  
  // 7. 压力自然影响
  if (character.attributes.stress > 70) {
    character.attributes.mentalHealth = clamp(character.attributes.mentalHealth - 1, 0, 100);
    character.attributes.health = clamp(character.attributes.health - 1, 0, 100);
  }
  
  // 8. 检查晋升
  let promotion: string | null = null;
  if (character.currentDay % 30 === 0) { // 每30天检查一次晋升
    promotion = checkPromotion(character);
    if (promotion) {
      character.attributes.position = promotion;
      character.attributes.reputation = clamp(character.attributes.reputation + 5, 0, 100);
      character.attributes.stress = clamp(character.attributes.stress + 10, 0, 100);
    }
  }
  
  // 9. 检查成就
  const newAchievements: string[] = [];
  if (character.attributes.wealth >= 50 && !character.attributes.achievements.includes('第一桶金')) {
    newAchievements.push('第一桶金');
  }
  if (character.attributes.networkStrength >= 80 && !character.attributes.achievements.includes('人脉达人')) {
    newAchievements.push('人脉达人');
  }
  if (character.attributes.technicalSkill >= 80 && !character.attributes.achievements.includes('技术专家')) {
    newAchievements.push('技术专家');
  }
  if (character.attributes.leadership >= 80 && !character.attributes.achievements.includes('管理新星')) {
    newAchievements.push('管理新星');
  }
  if (character.currentDay >= 100 && !character.attributes.achievements.includes('职场老手')) {
    newAchievements.push('职场老手');
  }
  if (character.currentDay >= 365 && !character.attributes.achievements.includes('传奇人物')) {
    newAchievements.push('传奇人物');
  }
  if (character.attributes.reputation >= 90 && !character.attributes.achievements.includes('行业认可')) {
    newAchievements.push('行业认可');
  }
  if (character.attributes.financialAcumen >= 80 && !character.attributes.achievements.includes('投资圣手')) {
    newAchievements.push('投资圣手');
  }
  
  for (const ach of newAchievements) {
    character.attributes.achievements.push(ach);
  }
  
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

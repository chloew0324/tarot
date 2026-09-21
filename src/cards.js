const p = (group, file) => `/cards/${group}/${file}.png`;

const major = [
  ["fool", "The Fool", "愚人", "38ab26dd-964d-4665-87f4-20123ac9b4ff", "新的开始、信任旅程、自由尝试", "冲动、准备不足、害怕迈步", "new beginnings, trust, and an open road", "recklessness, poor preparation, or fear of beginning"],
  ["magician", "The Magician", "魔术师", "82346ed4-dda2-4b95-8adc-c2401ffb06da", "主动创造、资源整合、意志专注", "能量分散、操控、怀疑能力", "initiative, resourcefulness, and focused will", "scattered energy, manipulation, or self-doubt"],
  ["high-priestess", "The High Priestess", "女祭司", "f1a8a45e-7865-4885-ad63-c5abe8aec1ac", "直觉、静观、隐藏的知识", "忽视直觉、秘密压力、内在噪音", "intuition, stillness, and hidden knowledge", "ignored intuition, burdensome secrets, or inner noise"],
  ["empress", "The Empress", "皇后", "30c99419-6446-4294-b3ae-14567145a4a3", "滋养、丰盛、创造力与感受", "过度付出、停滞、忽略自身需求", "nurture, abundance, creativity, and feeling", "overgiving, stagnation, or neglected needs"],
  ["emperor", "The Emperor", "皇帝", "c2998289-a836-4fa3-88de-3869b0a00961", "秩序、边界、稳定的领导力", "僵化、控制、权威冲突", "structure, boundaries, and steady leadership", "rigidity, control, or conflict with authority"],
  ["hierophant", "The Hierophant", "教皇", "e211e0e2-5f52-43f1-b905-f2a115bdfd45", "传统、学习、共同价值", "打破惯例、质疑规则、自寻道路", "tradition, learning, and shared values", "questioning convention and finding your own path"],
  ["lovers", "The Lovers", "恋人", "4f3c30f7-94e9-4e73-80b7-51b461731cae", "真诚联结、选择、价值一致", "关系失衡、犹疑、价值冲突", "honest connection, choice, and aligned values", "imbalance, indecision, or conflicting values"],
  ["chariot", "The Chariot", "战车", "63448576-c31f-4071-bb2e-430af0951425", "方向、决心、驾驭对立力量", "失去方向、急进、内在拉扯", "direction, resolve, and harnessed opposing forces", "lost direction, haste, or inner conflict"],
  ["strength", "Strength", "力量", "0dae2555-3b93-443c-9cff-fc044bb5bead", "温柔的勇气、耐心、自我掌控", "自我怀疑、压抑、情绪耗损", "gentle courage, patience, and self-command", "self-doubt, suppression, or emotional fatigue"],
  ["hermit", "The Hermit", "隐士", "dd97d092-d970-401b-bb94-f63cab43c7b9", "独处求真、内省、内在指引", "孤立、逃避、拒绝帮助", "solitude, reflection, and inner guidance", "isolation, avoidance, or refusing support"],
  ["wheel", "Wheel of Fortune", "命运之轮", "6010a9e9-822b-4b54-aa6e-0c577f5b4025", "转机、周期、顺势而为", "抗拒变化、反复模式、暂时停滞", "turning points, cycles, and moving with change", "resisting change, repeating patterns, or delay"],
  ["justice", "Justice", "正义", "42877624-17fb-4eb9-aeda-29136f389401", "诚实、平衡、因果与责任", "偏见、逃避责任、不公平", "truth, balance, consequence, and accountability", "bias, avoidance, or unfairness"],
  ["hanged-man", "The Hanged Man", "倒吊人", "08f9bfbd-161f-4195-a943-e062681fc91f", "暂停、换位思考、主动放下", "无谓拖延、执着、停滞不前", "pause, perspective, and willing surrender", "needless delay, attachment, or stagnation"],
  ["death", "Death", "死神", "7ed61550-c2f9-4a02-8130-5b1da9bc4f46", "结束与重生、深层转化、清理", "抗拒结束、停留过去、变化缓慢", "endings, renewal, deep change, and release", "resisting an ending, clinging to the past, or slow change"],
  ["temperance", "Temperance", "节制", "c31d33fa-13c5-4287-b607-06d6ebccc589", "调和、适度、耐心整合", "失衡、过度、节奏混乱", "harmony, moderation, and patient integration", "imbalance, excess, or a disrupted rhythm"],
  ["devil", "The Devil", "恶魔", "42250181-212c-418d-b64d-e9e06988083b", "看见束缚、欲望、物质执念", "挣脱限制、重获选择、面对阴影", "recognizing attachment, desire, and material fixation", "breaking limits, reclaiming choice, and facing the shadow"],
  ["tower", "The Tower", "高塔", "8fe7cc26-4da2-4680-98f6-90fb010039ab", "突然觉醒、结构崩解、真相显现", "延迟改变、内在震荡、避免危机", "sudden awakening, collapse, and revealed truth", "delayed change, inner upheaval, or avoiding a necessary break"],
  ["star", "The Star", "星星", "7367da2a-4139-4d8e-a7a6-9635a8c5a7ba", "希望、疗愈、清晰的信念", "失望、信心低落、与灵感断联", "hope, healing, and clear faith", "discouragement, low confidence, or lost inspiration"],
  ["moon", "The Moon", "月亮", "f7b8ef7d-9fb1-4add-b40d-8efafcf1232e", "潜意识、梦境、不确定中的直觉", "迷雾渐散、压抑恐惧、误解", "the subconscious, dreams, and intuition amid uncertainty", "clearing confusion, buried fear, or misreading signals"],
  ["sun", "The Sun", "太阳", "465b3c89-2ce6-4ce9-9bb4-9b6ac5176264", "喜悦、成功、坦诚与活力", "短暂阴霾、过度乐观、延迟的快乐", "joy, success, openness, and vitality", "temporary clouds, overconfidence, or delayed joy"],
  ["judgement", "Judgement", "审判", "b9005425-cae2-415a-8cfe-b7f45dfde4f8", "觉醒、回应召唤、宽恕过去", "自我批判、逃避召唤、迟疑", "awakening, answering a call, and forgiving the past", "self-judgment, avoidance, or hesitation"],
  ["world", "The World", "世界", "961213fa-6b58-4652-b3b1-4d1742ded978", "完成、整合、圆满与新阶段", "尚未收尾、缺少闭环、延误", "completion, integration, fulfillment, and a new chapter", "unfinished business, missing closure, or delay"]
].map(([id, en, cn, file, upZh, revZh, upEn, revEn]) => ({
  id, en, cn, suit: "major", image: p("大牌", file), upZh, revZh, upEn, revEn
}));

const suitInfo = {
  wands: { en: "Wands", cn: "权杖", group: "权杖组", domainZh: "行动、热情与创造", domainEn: "action, passion, and creativity" },
  cups: { en: "Cups", cn: "圣杯", group: "圣杯组", domainZh: "情感、关系与直觉", domainEn: "emotion, relationships, and intuition" },
  swords: { en: "Swords", cn: "宝剑", group: "宝剑组", domainZh: "思想、沟通与挑战", domainEn: "thought, communication, and challenge" },
  pentacles: { en: "Pentacles", cn: "星币", group: "金币组", domainZh: "资源、身体与现实成果", domainEn: "resources, the body, and tangible results" }
};

const files = {
  wands: { ace:"6a887fc4-290c-4015-ba46-800f6f196b49",two:"1fcbd4d7-02b3-4683-94a0-3ce3cb5b7faf",three:"dc618062-733b-4814-b2b3-9b9bf4bc77f9",four:"85faa581-f40f-4b94-bf57-79649e470544",five:"dc3d29ae-2cc8-40ef-9565-3237c557cc1d",six:"a11d70bd-dfe9-4d01-af0c-d0fbd4b40a71",seven:"62afd813-d154-425a-ad50-405db5e56e2f",eight:"4673e453-b8d6-4397-aa3e-2fc52858b042",nine:"3538dd1e-b1ea-4f09-bdc9-bbcdeed59e0a",ten:"3f29b49c-076c-4965-abe4-404acdc2d71c",page:"img_4248",knight:"bfbf3b27-6228-4e69-8ae9-a9196b1e75a6",queen:"83170df4-6988-49a8-98e7-bb42e2804edd",king:"8f241f1d-a373-4a72-9cd2-db73d626c7d5" },
  cups: { ace:"a8ed34f3-2a46-464e-8bca-4f565b9ac982",two:"3435230b-3b22-4f0b-8148-83c1f229df84",three:"63fb3840-5a4e-476a-bf09-b84b57eb0478",four:"6762df05-d228-4e86-80c0-acd6cc02bd70",five:"33d2623b-2a9a-46f4-8c3e-262fadc7229d",six:"658a6495-3a17-4370-bad6-36f68312307b",seven:"img_4267",eight:"fbf44f21-e200-4245-80ab-4e6debfbc24e",nine:"e17d11d8-a157-419a-bf6f-085ce2be1013",ten:"4d6d1ee7-ef08-4e53-a00d-f4ce9dbebbf2",page:"e792b395-2667-443b-af9e-2d3650ad737b",knight:"5c91cd6f-688a-4f09-94ef-75bc6eedf0ce",queen:"7cb074b1-8e77-414e-8464-a9ebb6b31b54",king:"d15015d6-1e32-412c-bed6-2d7532aa1ad6" },
  swords: { ace:"21e7c5c9-5cd1-4719-b324-e7795901f98e",two:"c0f4512d-2f7c-435b-8551-fe443c5bc1e7",three:"3ea891b8-9351-4c79-be22-c62288b8eb05",four:"cd595262-5082-49f0-9642-11ea0d7c2913",five:"2546c9e9-db54-40a5-9f1b-b2414aad02d0",six:"3f5d435b-cd4f-452d-a807-d6452170bbd6",seven:"2c4f10bf-7a7b-4b1c-9f49-0b56ac1047f1",eight:"c319ef57-394f-4c5e-a2fb-237b08714717",nine:"4700189b-6de6-4412-b3c1-f671613e9200",ten:"196d7096-0bd0-49f2-9ff7-c4e80d3767e8",page:"704573f9-99af-4279-935a-fc76c20f62fb",knight:"990ca89a-cdc8-4014-92e8-963bdb66f956",queen:"99e38be0-810d-442f-9bc7-702404135edb",king:"b2e762f3-4311-4961-ac83-8c3daf9726f7" },
  pentacles: { ace:"415c753a-646b-4358-b202-baf8bc6b6c20",two:"712e15d2-2409-4c06-b8bc-3456ca1c21e0",three:"9e4c2263-4866-4f79-9269-b8d550e413ac",four:"9c1feb30-e1a5-4a3a-acce-9f2d08b85a1e",five:"d1dec952-e169-4800-9dd4-c9d35f198030",six:"437e5bdc-d5e4-43d3-8fe3-5c98e1b4e2c4",seven:"e8ba2d14-5046-4025-850c-ba17c562fad8",eight:"f94b7c8e-81bc-450f-a24e-1ae20978d806",nine:"fe5a0670-78f6-4c07-b7c5-dae57671421d",ten:"881ca2a2-bf67-4298-b07d-b81d59831a6e",page:"8afda6af-d8f0-4f0c-8328-be3ead902ef2",knight:"d63fc503-ef43-492c-9cb6-6e5fa7023281",queen:"4bb3fc24-8175-463f-9244-5685ce24e24b",king:"a0df34fa-775a-4af9-8964-e7b9a082320c" }
};

const rankNames = {
  ace:["Ace","一"],two:["Two","二"],three:["Three","三"],four:["Four","四"],five:["Five","五"],six:["Six","六"],seven:["Seven","七"],eight:["Eight","八"],nine:["Nine","九"],ten:["Ten","十"],page:["Page","侍从"],knight:["Knight","骑士"],queen:["Queen","皇后"],king:["King","国王"]
};

const meanings = {
  wands: {
    ace:["灵感点燃、勇于开始","动力受阻、热情下降","inspiration, ignition, and a bold start","blocked momentum or fading enthusiasm"],
    two:["规划未来、拓展视野","犹豫不前、害怕未知","planning ahead and widening the horizon","indecision or fear of the unknown"],
    three:["进展、远见、等待成果","受限、延误、计划落空","progress, foresight, and results approaching","restriction, delay, or plans falling short"],
    four:["庆祝、归属、稳固基础","缺少支持、过渡不稳","celebration, belonging, and a stable base","weak support or an unsettled transition"],
    five:["竞争、观点碰撞、磨合","回避冲突、内耗消退","competition, friction, and creative tension","avoided conflict or tension beginning to ease"],
    six:["认可、胜利、信心提升","虚荣、认可延迟、失去信心","recognition, victory, and rising confidence","ego, delayed recognition, or lost confidence"],
    seven:["守住立场、勇敢应对","疲惫退让、防御过度","defending your ground with courage","fatigue, giving in, or over-defensiveness"],
    eight:["快速推进、消息到来","延迟、混乱、方向不一","swift movement and incoming news","delay, confusion, or scattered direction"],
    nine:["韧性、边界、最后坚持","精疲力竭、戒备过重","resilience, boundaries, and one last push","exhaustion or excessive guardedness"],
    ten:["责任繁重、接近完成","不堪重负、需要放下","heavy responsibility near completion","overload and a need to release burdens"],
    page:["好奇探索、创意讯息","缺乏方向、三分钟热度","curiosity, exploration, and creative news","lack of direction or short-lived enthusiasm"],
    knight:["大胆行动、冒险、魅力","冲动、急躁、后劲不足","bold action, adventure, and charisma","impulsiveness, impatience, or poor follow-through"],
    queen:["自信、独立、温暖吸引力","嫉妒、自我怀疑、忽略内心","confidence, independence, and warm magnetism","jealousy, self-doubt, or neglecting inner needs"],
    king:["远见领导、敢于承担","专横、鲁莽、不切实际","visionary leadership and bold responsibility","domination, rashness, or unrealistic ambition"]
  },
  cups: {
    ace:["情感开启、爱与直觉流动","情绪封闭、爱意受阻","an opening of feeling, love, and intuition","blocked emotion or difficulty receiving love"],
    two:["互相吸引、合作、平等联结","误解、失衡、关系紧张","mutual attraction, partnership, and equal connection","misunderstanding, imbalance, or tension"],
    three:["友谊、欢聚、共同庆祝","过度社交、流言、关系复杂","friendship, community, and shared joy","overindulgence, gossip, or social complication"],
    four:["沉思、重新评估、情感暂停","重新看见机会、走出冷漠","reflection, reassessment, and emotional pause","renewed interest and noticing an overlooked chance"],
    five:["失落、遗憾、哀伤","接受、疗愈、看见仍拥有的","loss, regret, and grief","acceptance, healing, and seeing what remains"],
    six:["回忆、纯真、温柔重逢","沉溺过去、不愿长大","memory, innocence, and tender reunion","living in the past or resisting growth"],
    seven:["选择众多、想象、可能性","看清幻想、做出选择","many choices, imagination, and possibility","seeing through illusion and making a choice"],
    eight:["主动离开、寻找更深意义","害怕离开、反复回头","walking away to seek deeper meaning","fear of leaving or repeatedly turning back"],
    nine:["满足、愿望实现、享受成果","空虚、纵欲、表面满足","contentment, wishes fulfilled, and enjoyment","emptiness, indulgence, or surface satisfaction"],
    ten:["情感圆满、家庭和谐、共享幸福","关系裂痕、理想落差","emotional fulfillment, harmony, and shared happiness","fracture, disconnection, or unmet ideals"],
    page:["温柔讯息、创意直觉、新感受","情绪幼稚、灵感受阻","gentle news, creative intuition, and new feeling","emotional immaturity or blocked inspiration"],
    knight:["浪漫表达、追随内心、邀请","幻想化、情绪反复、不切实际","romantic expression, invitation, and following the heart","idealization, moodiness, or impracticality"],
    queen:["共情、直觉成熟、温柔界限","敏感过度、依赖、情绪淹没","empathy, mature intuition, and gentle boundaries","oversensitivity, dependence, or emotional overwhelm"],
    king:["情绪稳定、慈悲、成熟支持","压抑情绪、操控、冷淡","emotional balance, compassion, and mature support","suppression, manipulation, or emotional distance"]
  },
  swords: {
    ace:["真相突破、清晰决定、新想法","混乱、误判、沟通不清","a breakthrough, clear decision, and new idea","confusion, misjudgment, or unclear communication"],
    two:["权衡、暂缓决定、保护内心","信息涌入、两难加剧、决定浮现","weighing options and pausing a decision","overload, sharpened conflict, or a decision emerging"],
    three:["心痛、真相刺痛、释放悲伤","修复、宽恕、伤口仍在","heartbreak, painful truth, and releasing grief","recovery, forgiveness, or a wound still healing"],
    four:["休息、恢复、安静整顿","疲惫难眠、过早行动","rest, recovery, and quiet regrouping","restlessness, burnout, or returning too soon"],
    five:["冲突、代价高昂的胜负","和解、放下争斗、余怨","conflict and victory at too high a cost","reconciliation, disengagement, or lingering resentment"],
    six:["过渡、离开风浪、缓慢前行","停滞、携带旧问题、抗拒移动","transition and moving beyond difficulty","stagnation, carried baggage, or resisted movement"],
    seven:["策略、独立行动、谨慎保留","真相暴露、自我欺骗、坦白","strategy, discretion, and independent action","exposure, self-deception, or confession"],
    eight:["自我限制、困局、思维束缚","松绑、看见选择、重新掌控","self-limitation and a constricting mindset","release, new options, and regained agency"],
    nine:["焦虑、失眠、反复担忧","希望回归、面对恐惧、逐渐恢复","anxiety, sleeplessness, and recurring worry","hope returning, facing fear, and gradual recovery"],
    ten:["痛苦终点、旧章结束、最低点","缓慢复原、抗拒结束、伤痛残留","a painful ending and the close of a chapter","slow recovery, resisted closure, or lingering pain"],
    page:["观察、求知、直接沟通","流言、草率判断、防御言辞","curiosity, observation, and direct communication","gossip, hasty judgment, or defensive speech"],
    knight:["果断、快速思考、直指目标","鲁莽、言辞锋利、方向混乱","decisive action, quick thought, and direct pursuit","recklessness, sharp words, or scattered direction"],
    queen:["清醒边界、独立判断、坦诚","冷漠、刻薄、偏见累积","clear boundaries, independent judgment, and honesty","coldness, harshness, or accumulated bias"],
    king:["理性权威、战略、伦理判断","滥用权力、僵化、情感断联","rational authority, strategy, and ethical judgment","misused power, rigidity, or emotional disconnection"]
  },
  pentacles: {
    ace:["现实机会、稳健开端、资源种子","错失机会、规划不足、不稳基础","a tangible opportunity, solid start, and seed of resources","a missed chance, poor planning, or shaky foundation"],
    two:["灵活协调、收支平衡、适应变化","失去平衡、事务过多、财务混乱","flexibility, balance, and adapting to change","imbalance, overload, or financial disorder"],
    three:["协作、技能成长、被看见的贡献","合作不良、标准不一、能力未发挥","collaboration, developing skill, and valued contribution","poor teamwork, mixed standards, or unused ability"],
    four:["守护资源、稳定、安全感","过度控制、吝啬、害怕失去","protecting resources, stability, and security","possessiveness, control, or fear of loss"],
    five:["匮乏、孤立、现实压力","复苏、获得支持、困难缓解","scarcity, isolation, and material strain","recovery, support arriving, and easing hardship"],
    six:["给予与接受、公平支持、资源流动","附带条件、不平等、债务压力","giving and receiving, fair support, and flowing resources","strings attached, inequality, or debt pressure"],
    seven:["耐心投入、评估进展、长期回报","急于见效、投入失衡、收效有限","patient investment, review, and long-term return","impatience, uneven effort, or limited yield"],
    eight:["专注练习、精进技能、踏实工作","机械重复、敷衍、缺少成长","focused practice, craftsmanship, and steady work","repetition without growth or careless work"],
    nine:["独立丰盛、品味、自我价值","依赖、过度消费、表面光鲜","independence, abundance, taste, and self-worth","dependence, overspending, or surface luxury"],
    ten:["长期稳定、传承、共同财富","家庭财务冲突、短期思维、不稳根基","lasting stability, legacy, and shared wealth","family money conflict, short-term thinking, or weak roots"],
    page:["学习实践、可靠消息、新计划","拖延、缺乏执行、目标模糊","practical study, reliable news, and a new plan","procrastination, poor follow-through, or vague goals"],
    knight:["持续行动、耐心负责、可靠","停滞、固执、工作失衡","steady action, patience, responsibility, and reliability","stagnation, stubbornness, or work imbalance"],
    queen:["务实关怀、资源管理、身心安定","自我忽略、失衡、物质焦虑","practical care, resourcefulness, and grounded wellbeing","self-neglect, imbalance, or material anxiety"],
    king:["成熟经营、稳定成果、长期视野","贪婪、顽固、只看收益","mature stewardship, stable results, and long vision","greed, stubbornness, or profit above values"]
  }
};

const minors = Object.entries(suitInfo).flatMap(([suit, info]) =>
  Object.entries(rankNames).map(([rank, [rankEn, rankZh]]) => {
    const [upZh, revZh, upEn, revEn] = meanings[suit][rank];
    return {
      id: `${suit}-${rank}`,
      en: `${rankEn} of ${info.en}`,
      cn: `${info.cn}${rankZh}`,
      suit,
      image: p(info.group, files[suit][rank]),
      upZh, revZh, upEn, revEn
    };
  })
);

export const cards = [...major, ...minors];
export const cardBack = p("back", "卡背");

export const spreads = {
  love: {
    count: 5,
    cn: "爱情 · 关系十字",
    en: "Love · Relationship Cross",
    promptCn: "看见彼此，也看见关系真正需要的空间。",
    promptEn: "See each person clearly, and the space the relationship needs.",
    positions: [
      ["你的状态", "Your energy"], ["对方／关系对象", "Their energy"],
      ["关系核心", "The bond"], ["当前挑战", "The challenge"], ["温柔指引", "Guidance"]
    ]
  },
  career: {
    count: 5,
    cn: "事业 · 成长路径",
    en: "Career · Growth Path",
    promptCn: "梳理你所在的位置，以及下一步值得投入的方向。",
    promptEn: "Clarify where you stand and where your effort can matter next.",
    positions: [
      ["当前处境", "Current situation"], ["你的优势", "Your strength"],
      ["需要跨越的", "The challenge"], ["正在靠近的机会", "The opportunity"], ["下一步行动", "Next action"]
    ]
  },
  wealth: {
    count: 4,
    cn: "财富 · 资源罗盘",
    en: "Wealth · Resource Compass",
    promptCn: "观察资源从哪里来、流向哪里，以及如何更稳地承接。",
    promptEn: "Notice where resources come from, where they flow, and how to hold them well.",
    positions: [
      ["现实基础", "Foundation"], ["资源流入", "Inflow"],
      ["资源流出", "Outflow"], ["稳健策略", "Grounded strategy"]
    ]
  },
  self: {
    count: 3,
    cn: "自我 · 内在镜像",
    en: "Self · Inner Mirror",
    promptCn: "让意识、阴影与整合中的自己彼此对话。",
    promptEn: "Let the conscious self, shadow, and integrating self speak together.",
    positions: [
      ["你已经知道的", "Conscious self"], ["尚未被看见的", "Shadow"], ["整合的方向", "Integration"]
    ]
  }
};

export function meaningFor(card, reversed, lang) {
  if (lang === "zh") return reversed ? card.revZh : card.upZh;
  return reversed ? card.revEn : card.upEn;
}

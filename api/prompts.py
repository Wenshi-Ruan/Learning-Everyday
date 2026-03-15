"""
提示词模板
"""

WRITER_PROMPT_TEMPLATE = """你是一位经验丰富的商业记者/作家，擅长用"杂志人物特写"和**传记式叙事**的方式写公司故事：语言生动、易读、有类比、有趣味细节、有故事线，像在读人物传记而不是说明书。禁止写成生硬的说明文或百科体；必须有人物、有情节、有因果、有温度。信息准确、洞察深刻、结构清晰、数据扎实。面向普通大众：尽量用人人听得懂的词，避免行业黑话；必要术语要用一句话解释。禁止编造事实与数字；凡关键数字/日期/财务口径/重大事件都必须来自提供的 FactPack，若 FactPack 中缺失或无法核实，可在文中简要带过或写"暂无公开数据"，不要猜。

**重要：本文目标阅读时间约5分钟（约1500-2000字），每个章节都必须有足够的深度和篇幅，不能过于简短。**

**严格要求：**
- **文体**：必须是故事/传记体，不是说明文。每章都要有叙事节奏、具体细节和因果，避免堆砌条目。
- **故事化与深度并重**：语言有温度、易读，但**分析能力必须到位**。禁止「长度够但深度浅」：每个板块都要有**具体案例、数据支撑、因果分析、与竞品/行业的对比、对投资或业务的意义**，而不是泛泛而谈。若 FactPack 中已有具体事件、产品名、数字，必须在文中体现并加以分析。
- **竞品分析**：写竞争对手时不得只写「XX 是 XX 领域的竞争对手」这类概括。必须写出**具体产品或业务**（如网易的《永劫无间》《蛋仔派对》等与腾讯哪款产品对打、是否长期霸榜或难以超越）、**可查到的市场事实**（市占、排名、增速等）、**竞争机制与影响**（为什么重要、对公司业务或战略的具体影响）。禁止仅用「XX 是强劲对手」之类概括。
- 每章必须达到指定的最低字数要求，不能偷工减料；每个段落都要有实质内容，避免空洞的概括。
- **语言统一**：全文使用中文。每一小节内只用中文，不要中英混杂（专有名词如公司名、品牌名可保留英文）。

写作目标：
- 故事感强：像写人物传记一样写公司，抓人、耐读、有节奏。
- 深度足够：每个部分都要有因果、背景、为什么重要、深层洞察。
- 数据与事实可靠：关键数字必须注明截至日期/财报口径（FYxxxx、TTM、截至YYYY-MM-DD等）。
- 洞察力：不仅要描述事实，更要分析"为什么"和"意味着什么"，提供独到见解。

**来源与引用规则：**
- 正文中**不要**出现（来源：[#id]）或任何引用标注。所有事实仍须基于 FactPack，但不要在段落里写来源。
- **不要**在文末自己写"## 来源"或"## Sources"章节；系统会在文章最下方自动追加来源列表。
- 若某事实无法从 FactPack 核实，可写"暂无公开数据"或一笔带过，勿编造。

输出结构（必须逐章输出，每章都要有足够篇幅）。**章节标题只用中文**（禁止中英双语，例如禁止写 "Industry study（行业研究）"），用 ## 加中文标题：

1) **开篇导语** - 至少3-4段（300-400字）
2) **创业故事** - 至少4-5段（400-500字）
3) **发展历程** - 每个节点至少1-2段，总共至少5-7段（500-700字）；每个节点要有具体事件、时间、结果或影响，并简要说明「为什么重要」。
4) **核心业务** - 至少4-5段（400-500字）；不只说「有游戏、云、广告」，要写出具体产品线或代表产品、收入结构或占比（若 FactPack 有）、增长驱动力与瓶颈。
5) **增长机会** - 至少4-5段（400-500字）；每个点要具体、可验证，并说明对业务/投资有何含义。
6) **挑战与瓶颈** - 至少3-4段（300-400字）；每个挑战要结合具体业务或事件，说明影响程度或应对方向。
7) **财务驱动因素** - 先输出一个财务数据表格，再写至少3-4段分析（合计400-500字）。
   - **表格（必须）**：
     - **纵轴（行）**：各指标一行，如 营收、毛利润、毛利率(%)、EBITDA、净利润、净利率(%)、每股收益(EPS)、市盈率(P/E)、市净率(P/B)、ROE、营收同比增速(%) 等（仅包含 FactPack 中有数据的指标），第一列表头为「指标」。
     - **横轴（列）**：时间，第一列为「指标」，其余列为 最近4个季度（如 2024-Q3、2024-Q2…）+ 最近5个财年（如 FY2024、FY2023…），按时间从新到旧排列。
     - **只保留有数据的时期**：若某季度或某年在 FactPack 中完全无数据，则不要为该时期单独设列，自动去掉该列，避免整列都是 N/A；只列出至少有一个指标有数据的时期。
     - 表格内缺失的单元格可填 "—"。表格后空一行。
   - **段落分析（必须）**：基于表格数据写 3-4 段，解读趋势、驱动因素、盈利能力与估值含义，而非复述表格数字；保持传记/故事体，有洞察。
8) **行业研究** - 至少3-4段（300-400字）；行业规模、格局、趋势要有数据或可比较维度，并与本公司定位结合。
9) **核心竞争对手** - 至少5-6段（500-600字）；每个主要竞品至少 1–2 段，须包含具体产品/业务名称、与本公司产品的直接竞争关系、市占/排名/爆款或霸榜等可查事实，以及为何构成威胁或难以超越、公司如何应对。禁止仅用「XX 是强劲对手」概括。
10) **市场情绪** - 至少3-4段（400-500字）；若有估值、股价、分析师观点或舆情，须具体写出并简要分析含义。
11) **关注信号** - 至少8-10个信号，每个3-5句话（500-600字）；每个点要具体、可验证，并说明若发生则对业务/投资有何含义。

写作语言：全文中文，每小节内仅用中文。**所有 ## 标题必须仅为中文，不得出现英文或中英双语标题。**
格式：Markdown（允许少量表格辅助，但正文必须以段落为主）。

---

现在，请基于以下 FactPack 数据，严格按照上述 11 章结构，生成一篇完整的公司故事文章。

FactPack 数据：
{factpack_json}

---

**重要提醒：**
1. 必须严格按照 11 章顺序输出，每章标题使用 Markdown 二级标题（##）
2. **每章都必须有足够的篇幅和深度，不能过于简短。目标总字数约1500-2000字。**
3. **第 7 章财务驱动因素**：先有一个 Markdown 表格——纵轴=指标（一行一个），横轴=时期（最近4季度+5财年），无数据的时期列省略不写；再写 3-4 段分析。
4. **正文中不要写任何（来源：…）或 Sources 章节；来源仅由系统在文末统一追加。**
5. 正文以段落为主，避免过度使用项目符号（第 11 章允许使用，但每个信号要2-4句话）
6. **文体必须是传记/故事体，生动有温度，禁止说明文、百科体。**
7. **每一小节只用一种语言（此处为中文），不要中英混杂。**
8. **章节标题只用中文**：例如写 ## 行业研究，禁止写 ## Industry study（行业研究）或中英双语标题。
9. **平衡质量与成本**：深度靠信息密度与洞察，不靠冗长重复；控制篇幅与 token，避免为堆砌字数而重复或无限展开。
"""

# 英文提示词模板
WRITER_PROMPT_TEMPLATE_EN = """You are an experienced business journalist/writer skilled in writing company stories in a "magazine feature" and **narrative/biographical** style: vivid language, readable, with analogies and interesting details, like reading a biography rather than a fact sheet. Do not write in a dry, expository or encyclopedic tone; include people, storylines, cause-and-effect, and warmth. Information must be accurate, insights deep, structure clear, and data solid. For the general public: use words everyone can understand, avoid jargon; explain necessary terms in one sentence. Do not fabricate facts or numbers; all key numbers/dates/financial metrics/major events must come from the provided FactPack. If FactPack is missing or cannot be verified, you may briefly note or write "no public data available"; do not guess.

**Important: This article targets a 5-minute reading time (approximately 1500-2000 words), and each section must have sufficient depth and length, not too brief.**

**Strict Requirements:**
- **Style**: Must be narrative/biographical, not expository. Each chapter should have a narrative rhythm, concrete details, and cause-and-effect; avoid bullet-style lists.
- **Narrative and depth together**: Language should be warm and readable, but **analytical depth is required**. No "long but shallow": every section must have **concrete examples, data, cause-effect analysis, comparison with competitors/industry, and so-what for investors or the business**. If FactPack contains specific events, product names, or numbers, they must appear in the text and be analyzed.
- **Competitor analysis**: Do not only write "X is a competitor in Y." You must include **specific products or businesses** (e.g. which NetEase games compete with which Tencent titles, whether they have long dominated charts or been hard to surpass), **verifiable market facts** (share, ranking, growth), and **competitive mechanism and impact** (why it matters, concrete impact on the company's business or strategy). No vague "X is a strong competitor" alone.
- Each section must meet the specified minimum word count; each paragraph must have substantial content, avoid empty generalizations.
- **One language per section**: The entire article is in English. Use only English within each section (proper nouns such as company or brand names may stay as-is).

Writing Goals:
- Strong narrative: Write about companies like writing biographies, engaging, readable, with rhythm.
- Sufficient depth: Each part must have cause and effect, background, why it matters, and deep insights.
- Reliable data and facts: Key numbers must note the date/financial reporting basis (FYxxxx, TTM, as of YYYY-MM-DD, etc.).
- Insight: Not only describe facts, but also analyze "why" and "what it means", providing unique insights.

**Sources and citations:**
- Do **not** include (Source: [#id]) or any in-text citations in the body. All facts must still be based on FactPack, but do not cite sources in the paragraphs.
- Do **not** output a "## Sources" or "## 来源" section at the end; the system will append the source list at the bottom automatically.
- If a fact cannot be verified from FactPack, write "no public data available" or skip briefly; do not invent.

Output Structure (must output chapter by chapter, each chapter must have sufficient length). **Section titles in English only** (no bilingual titles like "Industry study（行业研究）"); use ## followed by the English title only:

1) **Open remarks** - At least 3-4 paragraphs (300-400 words)
2) **Founding story** - At least 4-5 paragraphs (400-500 words)
3) **Development journey** - At least 1-2 paragraphs per node, total at least 5-7 paragraphs (500-700 words); each node must have concrete event, time, outcome or impact, and briefly "why it matters".
4) **Core business** - At least 4-5 paragraphs (400-500 words); do not only say "has games, cloud, ads"—include specific product lines or flagship products, revenue mix or share (if in FactPack), growth drivers and bottlenecks.
5) **Opportunity set & growth trajectory** - At least 4-5 paragraphs (400-500 words); each point should be concrete and verifiable, with implications for the business or investment.
6) **Challenges & bottlenecks** - At least 3-4 paragraphs (300-400 words); each challenge tied to specific business or events, with impact degree or response direction.
7) **Key financial driver** - First output a financial data table, then at least 3-4 paragraphs of analysis (total 400-500 words).
   - **Table (required)**:
     - **Rows (vertical axis)**: One row per metric, e.g. Revenue, Gross profit, Gross margin %, EBITDA, Net income, Net margin %, EPS, P/E, P/B, ROE, Revenue growth YoY %, etc. (only include metrics that have data in FactPack). First column header is "Metric".
     - **Columns (horizontal axis)**: First column = "Metric"; remaining columns = time periods: last 4 quarters (e.g. 2024-Q3, 2024-Q2…) then last 5 fiscal years (e.g. FY2024, FY2023…), newest to oldest.
     - **Include only periods with data**: If a quarter or year has no data in FactPack, do not add a column for it; omit that period so the table has no columns full of N/A. Only list periods that have at least one metric with data.
     - Use "—" for missing cells. Leave one blank line after the table.
   - **Paragraph analysis (required)**: Write 3-4 paragraphs interpreting trends, drivers, profitability and valuation implications—do not merely repeat the table; narrative style with insight.
8) **Industry study** - At least 3-4 paragraphs (300-400 words); industry size, structure, trends with data or comparable dimensions, and link to the company's position.
9) **Core competitors** - At least 5-6 paragraphs (500-600 words); at least 1–2 paragraphs per major competitor, with specific products/businesses, direct competition with the company's products, share/ranking/hit or chart-topping facts, why they threaten or are hard to surpass, and how the company responds. No "X is a strong competitor" only.
10) **Market sentiment** - At least 3-4 paragraphs (400-500 words); if valuation, share price, analyst view or sentiment exists, state it concretely and briefly interpret.
11) **What to watch for next** - At least 8-10 signals, each 3-5 sentences (500-600 words); each point concrete and verifiable, with "if this happens, what it means for the business or investment".

Writing Language: English only for the whole article. **All ## headings must be in English only; no Chinese or bilingual headings.**
Format: Markdown (tables allowed sparingly, but main text must be paragraphs).

---

Now, based on the following FactPack data, strictly follow the above 11-chapter structure to generate a complete company story article.

FactPack Data:
{factpack_json}

---

**Important Reminders:**
1. Must strictly follow the 11-chapter order, each chapter title uses Markdown level 2 heading (##)
2. **Each chapter must have sufficient length and depth, not too brief. Target total word count approximately 1500-2000 words.**
3. **Chapter 7 Key financial driver**: One Markdown table first—rows = metrics (one per row), columns = time periods (last 4 quarters + 5 years); omit period columns that have no data; then 3-4 paragraphs of analysis.
4. **Do not write any (Source: …) in the body or output a Sources section; sources will be appended at the end by the system.**
5. Main text should be paragraphs, avoid excessive use of bullet points (Chapter 11 allows it, but each signal should be 2-4 sentences)
6. **Style must be narrative/biographical, vivid and warm; avoid expository or encyclopedic tone.**
7. **Use only one language per section (here: English); do not mix languages within a section.**
8. **Section titles in English only**: e.g. use ## Industry study, not ## Industry study（行业研究）or any bilingual title.
9. **Balance quality and cost**: Depth comes from information density and insight, not length or repetition; keep length and token usage under control, avoid padding or endless expansion.
"""

FACT_PACK_PROMPT = """你是一位专业的商业研究分析师。请基于提供的公司信息（公司名或股票代码：{company_input}），生成一份**非常详细和全面**的 FactPack（事实包）。这份 FactPack 将用于生成一篇**传记式、故事化**的公司文章（目标阅读时间约5分钟），因此需要包含足够丰富的信息、细节和叙事素材（创始人故事、里程碑、轶事、行业背景等），而不仅是干巴巴的数据条目。

**重要要求：**
1. 如果启用了 web_search，**适度穷尽搜索**：在返回关键财务字段为 N/A 或 null 之前，先从以下类型信息源检索；但**不要无限增加搜索次数或拉长输出**。适度 = 覆盖主要来源与最近年度/季度，拿到足够制表与分析的素材即可；**控制 FactPack 篇幅与 token 消耗，平衡质量与成本**。在穷尽下列来源前不将财务标为 N/A；每类来源 1～2 次针对性搜索即可：
   - **金融/行情**：Yahoo Finance（如 "Tencent 0700.HK financials"、"公司名 + stock income statement"、最新年报/季报）、Bloomberg、Reuters、Morningstar、东方财富、同花顺；
   - **公司官方**：投资者关系页、annual report、quarterly earnings、财报摘要、最新一至两期业绩；
   - **交易所/监管**：港交所披露、SEC、公司公告；
   - **中文/本地**：公司中文名 + 财报、年报、季报、2024 业绩、营收、净利润等。
   对**中国/香港/国际非美股公司**，须用**中英文多种关键词**分别搜索（如 Tencent 2024 revenue、腾讯 2024 年报、公司名 + 最新财报），**只有在上述来源均无法找到对应数据时**才可在 FactPack 中填 null 或 N/A，否则一律填入从可靠来源获取的数值并标注 source_id。
2. 如果未启用 web_search，请基于你的知识库生成，但必须明确标注"可能过时"并生成建议搜索的关键词
3. 所有关键数字和事实必须标注来源（URL、标题、发布日期、访问日期）
4. **财务数据必须优先最新年度与季度**：Yahoo Finance、公司 IR、交易所披露等通常有 2024、2023 及最近季度数据；**必须先检索并填入最近 2–3 个财年及最近 4 个季度的数据**，再补充更早年度。若来源中明确有 2024/2023 数据，则 FactPack 中**不得仅填写 2022 年或更早年度而忽略最新数据**。指标包含：营收、毛利润、毛利率、EBITDA、净利润、净利率、EPS、经营现金流及 P/E、P/B、ROE、营收同比增速等；均需标注财年或报告期（如 FY2024、FY2023、2024-Q3）。在穷尽上述搜索前不将财务指标设为 N/A。
5. 新闻时间窗口：近 {market_days} 天，需要包含**详细的事件描述和影响分析**
6. **时间线必须包含 5-7 个关键历史节点，每个节点都要有详细的背景、事件、影响描述**（便于写成故事线）
7. **竞争对手至少 4 类，每类 2-5 个代表**；每个竞品须提供**可支撑深度分析的素材**，而非仅一句概括：具体产品/业务线名称（如网易的某款游戏、字节的抖音、阿里的云产品或电商）、与本公司产品的直接竞争关系、可查到的市占/排名/爆款或霸榜事实、为何构成威胁或难以超越（一句话供文章展开）。其他板块（业务、行业、风险、新闻）也须有**具体事件、数字、产品名、时间节点**，便于文章写出有案例、有数据的分析。
8. **风险列表 5-8 个，每个风险都要有详细的描述和影响分析**
9. **新闻列表 5-10 条，每条都要有详细的摘要、影响和背景**
10. **公司信息要尽可能详细**：创始人背景、创业故事、企业文化、关键人物、组织架构等（便于传记式叙事）
11. **业务信息要深入**：产品细节、客户画像、渠道分析、定价策略等
12. **行业信息要全面**：行业规模、趋势、价值链、竞争格局等

输出格式：严格的 JSON，必须符合以下 FactPack Schema：

{factpack_schema}

重要：
- 每个数字、日期、事件都必须有对应的 source_id，指向 sources 列表中的条目
- sources 列表中的每条必须包含：id、title、url、publisher、published_date（如可获取）、accessed_date（今天日期：{today_date}）、used_for（被引用到的字段列表）
- 如果某个信息无法找到可靠来源，在相应字段中写 null 或空数组，但不要编造
- 财务数据必须标注财年、截至日期、口径（GAAP/Non-GAAP）
- **财务指标（revenue、net_income、EPS、P/E 等）**：必须先通过 web_search 查询 Yahoo Finance、公司财报、交易所披露等来源；只有确实无法从这些渠道获取时才能填 null/N/A，否则必须填入查到的数据并注明 source_id
- 估值信息如果无法可靠获取，在 note 字段中说明原因
- **适度穷尽**：不要为追求极致全面而无限增加搜索或拉长 JSON 输出；覆盖关键来源与最近年度/季度即可，平衡质量与 token 成本。

现在开始生成 FactPack JSON：
"""

Generate [NUMBER] YouTube video scripts.

Each script should have a maximum duration of around 60 seconds and around 500 Chracters and cover topics [FACTNAME].

These scripts must be both clickbait-style to immediately grab attention and genuinely informative, ensuring the core information presented is accurate.

Each script must be designed to maximize viewer retention and engagement by:

- Starting with a compelling curiosity gap that immediately grabs attention.
- Clearly promising a specific benefit or valuable takeaway within the first few sentences.
- Building intrigue and suspense by strategically revealing information.
- Using strong emotional language and evocative descriptions where appropriate.
- Maintaining a fast pace and incorporating variety in sentence structure and content delivery.
- Framing information within a relatable context or addressing the viewer directly.
- Ending with a _single, random_ call to action (either "like the video," "subscribe to the channel," or ask video relevent question so that they answer in comment). Do not include more than one of these CTAs in a single script.

The target audience for these videos is Young and Mid-Aged.

Provide the output in a markdown table with four columns: `SL`, `ID`, `Title`, `Script`, `Hashtags`, and `image prompt`.

`SL` Column : it's incremental number
`ID` Column : it's incremental number with topics like - health_benifits_1, health_benifits_2, health_benifits_3 or fun_1, fun_2, fun_3
`Title` Column : Short Video Title, that will be used as video Caption
`Script` Column : Video Script, which will be used to generate Speech using tts. Follow the Above instruction to generate Script
`Hashtags` Column : 5 Viral Relevent Hastags to get more views
`image prompt` Column : Analyze the whole Script, Based on the Script you have to Generate Image Prompts. Image Prompt should be absolutely relevent with The Script's topic. Go through each sentence in the `Script`. For each sentence, Define short and Script And Sentence Relevent Image Prompt. List these concise image prompts as a comma-separated string.

Ensure all generated scripts are unique and do not repeat concepts from previous requests.



______----------------------------_______________-----------____----___---___----___---___----_________----------__----___----_-----_-----__---____



**Generate [NUMBER] unique YouTube Shorts video scripts based on the topic(s): [FACTNAME].**

Each script should meet the following requirements:

### 🕐 **Duration & Length**

* Maximum video length: ~60 seconds.
* Text length: Minimum 800 characters per script.

### 🎯 **Script Style & Purpose**

Scripts must be:

* **Clickbait-style** — crafted to grab attention instantly.
* **Genuinely informative** — factual, accurate, and valuable.
* **Optimized for retention** — structured to keep viewers watching.

### ✍️ **Script Writing Guidelines**

Each script should:

1. **Hook instantly** with a curiosity gap or shocking fact.
2. **Promise value early** — state a specific benefit or takeaway.
3. **Reveal info gradually** to build intrigue and suspense.
4. **Use emotional or vivid language** where appropriate.
5. **Keep a fast, punchy pace** — use varied sentence lengths and styles.
6. **Address the viewer directly** or use a relatable context.
7. **End with *one* random call-to-action**, selected from:

   * “Like the video”
   * “Subscribe to the channel”
   * A thought-provoking, relevant question prompting a comment

   > ⚠️ Do not include more than one CTA in any script.

### 🎯 **Target Audience**

* Young to mid-aged viewers (approx. 18–45 years old).

---

### 📄 **Output Format**

Provide the results in a Markdown table with the following columns:

| SL | ID | Title | Script | Hashtags | Image Prompt |
| -- | -- | ----- | ------ | -------- | ------------ |

#### Column Details:

* `SL`: Incremental number (e.g., 1, 2, 3...)
* `ID`: A unique slug per entry, combining topic and index (e.g., `health_benefits_1`, `fun_facts_2`)
* `Title`: Short, engaging video title (used as YouTube caption).
* `Script`: 500-character max, structured per the script writing guidelines above.
* `Hashtags`: Exactly 5 viral and topic-relevant hashtags.
* `Image Prompt`: First, analyze the entire script to understand its main topic and narrative direction. Then, go through each sentence individually and, based on its meaning and the script's overall theme, create a short, descriptive, and highly relevant image prompt for that sentence. Finally, compile all these sentence-based image prompts into a comma-separated string. The result should visually represent the flow of the script and accurately reflect its tone, subject, and key ideas.



const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(filename, mimeType) {
  const fullPath = path.join("/Users/richard/Desktop/ottolenghi simple", filename);
  const uploadResult = await fileManager.uploadFile(fullPath, {
    mimeType,
    displayName: filename,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("IMG_0009.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0112.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0110.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0109.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0108.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0107.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0106.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0105.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0104.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0103.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0102.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0101.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0100.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0097.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0096.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0095.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0094.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0093.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0092.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0091.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0090.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0089.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0088.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0087.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0086.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0085.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0084.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0083.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0082.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0080.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0079.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0078.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0077.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0076.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0075.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0074.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0073.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0072.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0071.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0070.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0069.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0068.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0067.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0066.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0065.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0064.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0063.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0062.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0061.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0060.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0059.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0058.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0057.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0056.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0055.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0054.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0053.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0052.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0051.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0050.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0049.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0048.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0047.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0046.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0045.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0044.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0043.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0042.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0041.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0040.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0039.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0038.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0037.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0036.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0035.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0034.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0033.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0032.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0031.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0030.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0029.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0028.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0026.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0025.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0024.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0023.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0022.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0021.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0020.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0019.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0018.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0017.jpeg", "image/jpeg"),
    await uploadToGemini("IMG_0009.jpeg", "image/jpeg"),
  ];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
          {text: "I have attached pictures that each contain a recipe. I want you to convert the images to an array of JSON objects. Each picture contains the following elements which should represent their own JSON attributes: a title, a description, coloured labels which will be one or more of \"S\", \"I\", \"M\", \"P\", \"L\", \"E\", how many people the recipe serves, a list of steps to make the recipe. Ignore page numbers. Each object should also contain the key \"book\" and the value \"Ottolenghi simple\". For the ingredients I want you to break them down as follows:\n- quantity (such as the \"½\" in \"½ cup/10g mint leaves, roughly shredded\")\n- unit (such as the \"cup\" in \"½ cup/10g mint leaves, roughly shredded\")\n- name (such as \"mint leaves\" in \"½ cup/10g mint leaves, roughly shredded\")\n- descriptor (such as \"roughly shredded\" in \"½ cup/10g mint leaves, roughly shredded\"). I want you to process the labels too:\n- if you see S, the label value should be \"short-on-time\"\n- if you see I, the label value should be \"ten-ingredients\",\n- if you see M, the label value should be \"make-ahead\",\n- if you see P, the label value should be \"pantry\"\n- if you see L, the label value should be \"lazy\"\n- if you see E, the label value should be \"easier\". "},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[1].mimeType,
              fileUri: files[1].uri,
            },
          },
          {
            fileData: {
              mimeType: files[2].mimeType,
              fileUri: files[2].uri,
            },
          },
          {
            fileData: {
              mimeType: files[3].mimeType,
              fileUri: files[3].uri,
            },
          },
          {
            fileData: {
              mimeType: files[4].mimeType,
              fileUri: files[4].uri,
            },
          },
          {
            fileData: {
              mimeType: files[5].mimeType,
              fileUri: files[5].uri,
            },
          },
          {
            fileData: {
              mimeType: files[6].mimeType,
              fileUri: files[6].uri,
            },
          },
          {
            fileData: {
              mimeType: files[7].mimeType,
              fileUri: files[7].uri,
            },
          },
          {
            fileData: {
              mimeType: files[8].mimeType,
              fileUri: files[8].uri,
            },
          },
          {
            fileData: {
              mimeType: files[9].mimeType,
              fileUri: files[9].uri,
            },
          },
          {
            fileData: {
              mimeType: files[10].mimeType,
              fileUri: files[10].uri,
            },
          },
          {
            fileData: {
              mimeType: files[11].mimeType,
              fileUri: files[11].uri,
            },
          },
          {
            fileData: {
              mimeType: files[12].mimeType,
              fileUri: files[12].uri,
            },
          },
          {
            fileData: {
              mimeType: files[13].mimeType,
              fileUri: files[13].uri,
            },
          },
          {
            fileData: {
              mimeType: files[14].mimeType,
              fileUri: files[14].uri,
            },
          },
          {
            fileData: {
              mimeType: files[15].mimeType,
              fileUri: files[15].uri,
            },
          },
          {
            fileData: {
              mimeType: files[16].mimeType,
              fileUri: files[16].uri,
            },
          },
          {
            fileData: {
              mimeType: files[17].mimeType,
              fileUri: files[17].uri,
            },
          },
          {
            fileData: {
              mimeType: files[18].mimeType,
              fileUri: files[18].uri,
            },
          },
          {
            fileData: {
              mimeType: files[19].mimeType,
              fileUri: files[19].uri,
            },
          },
          {
            fileData: {
              mimeType: files[20].mimeType,
              fileUri: files[20].uri,
            },
          },
          {
            fileData: {
              mimeType: files[21].mimeType,
              fileUri: files[21].uri,
            },
          },
          {
            fileData: {
              mimeType: files[22].mimeType,
              fileUri: files[22].uri,
            },
          },
          {
            fileData: {
              mimeType: files[23].mimeType,
              fileUri: files[23].uri,
            },
          },
          {
            fileData: {
              mimeType: files[24].mimeType,
              fileUri: files[24].uri,
            },
          },
          {
            fileData: {
              mimeType: files[25].mimeType,
              fileUri: files[25].uri,
            },
          },
          {
            fileData: {
              mimeType: files[26].mimeType,
              fileUri: files[26].uri,
            },
          },
          {
            fileData: {
              mimeType: files[27].mimeType,
              fileUri: files[27].uri,
            },
          },
          {
            fileData: {
              mimeType: files[28].mimeType,
              fileUri: files[28].uri,
            },
          },
          {
            fileData: {
              mimeType: files[29].mimeType,
              fileUri: files[29].uri,
            },
          },
          {
            fileData: {
              mimeType: files[30].mimeType,
              fileUri: files[30].uri,
            },
          },
          {
            fileData: {
              mimeType: files[31].mimeType,
              fileUri: files[31].uri,
            },
          },
          {
            fileData: {
              mimeType: files[32].mimeType,
              fileUri: files[32].uri,
            },
          },
          {
            fileData: {
              mimeType: files[33].mimeType,
              fileUri: files[33].uri,
            },
          },
          {
            fileData: {
              mimeType: files[34].mimeType,
              fileUri: files[34].uri,
            },
          },
          {
            fileData: {
              mimeType: files[35].mimeType,
              fileUri: files[35].uri,
            },
          },
          {
            fileData: {
              mimeType: files[36].mimeType,
              fileUri: files[36].uri,
            },
          },
          {
            fileData: {
              mimeType: files[37].mimeType,
              fileUri: files[37].uri,
            },
          },
          {
            fileData: {
              mimeType: files[38].mimeType,
              fileUri: files[38].uri,
            },
          },
          {
            fileData: {
              mimeType: files[39].mimeType,
              fileUri: files[39].uri,
            },
          },
          {
            fileData: {
              mimeType: files[40].mimeType,
              fileUri: files[40].uri,
            },
          },
          {
            fileData: {
              mimeType: files[41].mimeType,
              fileUri: files[41].uri,
            },
          },
          {
            fileData: {
              mimeType: files[42].mimeType,
              fileUri: files[42].uri,
            },
          },
          {
            fileData: {
              mimeType: files[43].mimeType,
              fileUri: files[43].uri,
            },
          },
          {
            fileData: {
              mimeType: files[44].mimeType,
              fileUri: files[44].uri,
            },
          },
          {
            fileData: {
              mimeType: files[45].mimeType,
              fileUri: files[45].uri,
            },
          },
          {
            fileData: {
              mimeType: files[46].mimeType,
              fileUri: files[46].uri,
            },
          },
          {
            fileData: {
              mimeType: files[47].mimeType,
              fileUri: files[47].uri,
            },
          },
          {
            fileData: {
              mimeType: files[48].mimeType,
              fileUri: files[48].uri,
            },
          },
          {
            fileData: {
              mimeType: files[49].mimeType,
              fileUri: files[49].uri,
            },
          },
          {
            fileData: {
              mimeType: files[50].mimeType,
              fileUri: files[50].uri,
            },
          },
          {
            fileData: {
              mimeType: files[51].mimeType,
              fileUri: files[51].uri,
            },
          },
          {
            fileData: {
              mimeType: files[52].mimeType,
              fileUri: files[52].uri,
            },
          },
          {
            fileData: {
              mimeType: files[53].mimeType,
              fileUri: files[53].uri,
            },
          },
          {
            fileData: {
              mimeType: files[54].mimeType,
              fileUri: files[54].uri,
            },
          },
          {
            fileData: {
              mimeType: files[55].mimeType,
              fileUri: files[55].uri,
            },
          },
          {
            fileData: {
              mimeType: files[56].mimeType,
              fileUri: files[56].uri,
            },
          },
          {
            fileData: {
              mimeType: files[57].mimeType,
              fileUri: files[57].uri,
            },
          },
          {
            fileData: {
              mimeType: files[58].mimeType,
              fileUri: files[58].uri,
            },
          },
          {
            fileData: {
              mimeType: files[59].mimeType,
              fileUri: files[59].uri,
            },
          },
          {
            fileData: {
              mimeType: files[60].mimeType,
              fileUri: files[60].uri,
            },
          },
          {
            fileData: {
              mimeType: files[61].mimeType,
              fileUri: files[61].uri,
            },
          },
          {
            fileData: {
              mimeType: files[62].mimeType,
              fileUri: files[62].uri,
            },
          },
          {
            fileData: {
              mimeType: files[63].mimeType,
              fileUri: files[63].uri,
            },
          },
          {
            fileData: {
              mimeType: files[64].mimeType,
              fileUri: files[64].uri,
            },
          },
          {
            fileData: {
              mimeType: files[65].mimeType,
              fileUri: files[65].uri,
            },
          },
          {
            fileData: {
              mimeType: files[66].mimeType,
              fileUri: files[66].uri,
            },
          },
          {
            fileData: {
              mimeType: files[67].mimeType,
              fileUri: files[67].uri,
            },
          },
          {
            fileData: {
              mimeType: files[68].mimeType,
              fileUri: files[68].uri,
            },
          },
          {
            fileData: {
              mimeType: files[69].mimeType,
              fileUri: files[69].uri,
            },
          },
          {
            fileData: {
              mimeType: files[70].mimeType,
              fileUri: files[70].uri,
            },
          },
          {
            fileData: {
              mimeType: files[71].mimeType,
              fileUri: files[71].uri,
            },
          },
          {
            fileData: {
              mimeType: files[72].mimeType,
              fileUri: files[72].uri,
            },
          },
          {
            fileData: {
              mimeType: files[73].mimeType,
              fileUri: files[73].uri,
            },
          },
          {
            fileData: {
              mimeType: files[74].mimeType,
              fileUri: files[74].uri,
            },
          },
          {
            fileData: {
              mimeType: files[75].mimeType,
              fileUri: files[75].uri,
            },
          },
          {
            fileData: {
              mimeType: files[76].mimeType,
              fileUri: files[76].uri,
            },
          },
          {
            fileData: {
              mimeType: files[77].mimeType,
              fileUri: files[77].uri,
            },
          },
          {
            fileData: {
              mimeType: files[78].mimeType,
              fileUri: files[78].uri,
            },
          },
          {
            fileData: {
              mimeType: files[79].mimeType,
              fileUri: files[79].uri,
            },
          },
          {
            fileData: {
              mimeType: files[80].mimeType,
              fileUri: files[80].uri,
            },
          },
          {
            fileData: {
              mimeType: files[81].mimeType,
              fileUri: files[81].uri,
            },
          },
          {
            fileData: {
              mimeType: files[82].mimeType,
              fileUri: files[82].uri,
            },
          },
          {
            fileData: {
              mimeType: files[83].mimeType,
              fileUri: files[83].uri,
            },
          },
          {
            fileData: {
              mimeType: files[84].mimeType,
              fileUri: files[84].uri,
            },
          },
          {
            fileData: {
              mimeType: files[85].mimeType,
              fileUri: files[85].uri,
            },
          },
          {
            fileData: {
              mimeType: files[86].mimeType,
              fileUri: files[86].uri,
            },
          },
          {
            fileData: {
              mimeType: files[87].mimeType,
              fileUri: files[87].uri,
            },
          },
          {
            fileData: {
              mimeType: files[88].mimeType,
              fileUri: files[88].uri,
            },
          },
          {
            fileData: {
              mimeType: files[89].mimeType,
              fileUri: files[89].uri,
            },
          },
          {
            fileData: {
              mimeType: files[90].mimeType,
              fileUri: files[90].uri,
            },
          },
          {
            fileData: {
              mimeType: files[91].mimeType,
              fileUri: files[91].uri,
            },
          },
          {
            fileData: {
              mimeType: files[92].mimeType,
              fileUri: files[92].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("Please give me the JSON for the attached files as described.");
  console.log(result.response.text());
}

run();
"use server";

import Anthropic from "@anthropic-ai/sdk";

export const analyzeContract = async (contractCode: string) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 8192,
      temperature: 0,
      system:
        "Pretend that you are a function that retrieves a html file. Your task is to perform a comprehensive security analysis of the provided smart contract code. Analyze the contract for potential vulnerabilities based on the Smart Contract Weakness Enumeration (SCWE) and Smart Contract Weakness Classification (SWC) standards. \n\nFor each identified vulnerability:\n1. Highlight the specific code section where the vulnerability exists\n2. Classify the vulnerability according to SWC and SCWE standards\n3. Explain the potential security impact\n4. Provide recommended mitigation strategies\n\nYour analysis should prioritize critical vulnerabilities that could lead to financial loss, unauthorized access, or contract manipulation. Include both direct vulnerabilities in the code and potential attack vectors that could exploit the contract's logic.\n\nPresent your findings in a structured format with clear sections for:\n- Executive Summary\n- Critical Vulnerabilities\n- Moderate Vulnerabilities\n- Minor Vulnerabilities\n- Best Practices Recommendations\n\n The goal is to provide to the user a checklist of the vulnerabilities and the mitigation strategies. Your response must be a a pure html table using tailwind with no colors related tags, such as background-color",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: contractCode,
            },
          ],
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return "<div class='text-red-500'>Error analyzing contract. Please try again.</div>";
  }
};

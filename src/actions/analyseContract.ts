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

    return message.content[0].type === "text" ? message.content[0].text : "";
  } catch (error) {
    console.error("Error analyzing contract:", error);

    // Enhanced error handling with specific responses for different error types
    // Check if it's an API error from Anthropic
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as {
        status: number;
        request_id?: string;
        message?: string;
      };

      const status = apiError.status as number;

      // Handle rate limiting and overloaded errors
      if (status === 429) {
        return "<div class='text-red-500'>Rate limit exceeded. Please try again in a few minutes.</div>";
      } else if (status === 529) {
        return "<div class='text-red-500'>The AI service is currently experiencing high demand. Please try again in a few minutes.</div>";
      } else if (status === 400) {
        return "<div class='text-red-500'>Invalid request. The contract code may be too large or contain invalid characters.</div>";
      } else if (status === 401) {
        return "<div class='text-red-500'>Authentication error. Please check your API key configuration.</div>";
      } else if (status >= 500 && status < 600) {
        return "<div class='text-red-500'>Server error. The AI service is currently experiencing issues. Please try again later.</div>";
      }

      // Include request ID if available for troubleshooting
      const requestId = apiError.request_id
        ? ` (Request ID: ${apiError.request_id})`
        : "";
      return `<div class='text-red-500'>Error analyzing contract: ${apiError.message}${requestId}</div>`;
    }

    // For network errors or other unexpected issues
    return "<div class='text-red-500'>Error analyzing contract. Please check your network connection and try again.</div>";
  }
};

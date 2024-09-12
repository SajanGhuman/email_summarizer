const axios = require("axios");

// Replace with your Hugging Face API token
const API_TOKEN = "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";

const text = `We’re ready for you! 🙌

Every year, developers, enterprise leaders, and security professionals from around the globe come together at GitHub Universe to stay ahead of the latest trends in software development, foster team growth, and learn by doing. 

This year, join them from October 29-30 in San Francisco at the Fort Mason Center. (Virtual attendance is free!) 

Those that attend in person will get access to two days of engaging sessions, discussions, and interactive experiences. And if you attend virtually, you’ll be able to tune into streamed keynotes and a curated selection of live sessions. 

Here’s a glimpse of what’s in store:

    Our biggest Universe yet with a record-breaking 3,500 attendees (that’s over 50% more in-person attendees than last year). 🤯 

    Five stages hosting more than 150 speakers and 100 sessions on the latest products and best practices in AI, security, and DevEx (developer experience). 🗣️

    Onsite GitHub Certification testing and workshops. 💻

    IRL GitHub Shop with the latest Universe swag. 🛍️

    Tasty grub and beverages all included in the price of your in-person ticket. 😋`;

async function summarizeText(text, retryCount = 3) {
  const apiUrl =
    "https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY";

  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  const data = {
    inputs: text,
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });

    // Check if the model is still loading
    if (response.data.error && response.data.error.includes("loading")) {
      console.log(
        `Model is loading, estimated time: ${response.data.estimated_time} seconds.`,
      );

      // Retry after a delay if attempts are remaining
      if (retryCount > 0) {
        console.log("Retrying in 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds
        return summarizeText(text, retryCount - 1);
      } else {
        console.log("Max retries reached. Please try again later.");
      }
    } else {
      const summary = response.data[0]?.summary_text;
      console.log("Summary:", summary);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
  }
}

summarizeText(text);

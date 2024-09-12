function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength);
  }
  return text;
}

document
  .getElementById("summarizeBtn")
  .addEventListener("click", async function () {
    let text = document.getElementById("inputText").value;

    if (!text) {
      alert("Please enter some text to summarize.");
      return;
    }

    // Truncate the text to 512 characters
    text = truncateText(text, 512);

    const apiUrl =
      "https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY";
    const apiToken = "YOUR-HUGGING-FACE-ACCESS-TOKEN"; // Use your token

    const headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      inputs: text,
    };

    try {
      document.getElementById("summaryText").textContent = "Summarizing...";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        document.getElementById("summaryText").textContent =
          `Error: ${errorData.error || "Unknown error occurred"}`;
        return;
      }

      const result = await response.json();

      if (result.error && result.error.includes("loading")) {
        document.getElementById("summaryText").textContent =
          `Model is still loading. Please try again later. Estimated time: ${result.estimated_time} seconds.`;
      } else {
        const summary = result[0]?.summary_text;
        document.getElementById("summaryText").textContent =
          summary || "No summary available";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("summaryText").textContent =
        "Error summarizing text.";
    }
  });

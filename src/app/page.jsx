"use client";
import React from "react";

function MainComponent() {
  const [search, setSearch] = React.useState("");
  const [businessData, setBusinessData] = React.useState(null);
  const [portfolioImages, setPortfolioImages] = React.useState([]);
  const [portfolioText, setPortfolioText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSearchInputChange = (event) => setSearch(event.target.value);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const googleSearchResponse = await fetch(
        `https://www.create.xyz/integrations/google-search/search?q=${encodeURIComponent(
          search
        )}`,
        { method: "GET" }
      );
      const googleSearchData = await googleSearchResponse.json();
      setBusinessData(googleSearchData.items[0]);

      const imageSearchResponse = await fetch(
        `https://www.create.xyz/integrations/image-search/imagesearch?q=${encodeURIComponent(
          search
        )}`,
        { method: "GET" }
      );
      const imageData = await imageSearchResponse.json();
      setPortfolioImages(imageData.items);

      const placeAutocompleteResponse = await fetch(
        `https://www.create.xyz/integrations/google-place-autocomplete/autocomplete/json?input=${encodeURIComponent(
          search
        )}&radius=500`,
        { method: "GET" }
      );
      const placeData = await placeAutocompleteResponse.json();

      const localBusinessResponse = await fetch(
        `https://www.create.xyz/integrations/local-business-data/search?query=${encodeURIComponent(
          search
        )}`,
        { method: "GET" }
      );
      const localBusinessData = await localBusinessResponse.json();

      const chatGPTResponse = await fetch(
        "https://www.create.xyz/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          body: JSON.stringify({
            messages: [
              { role: "user", content: `${search}` },
              {
                role: "system",
                content:
                  "Summarize the business details and suggest a portfolio structure.",
              },
            ],
            system_prompt:
              "Create a portfolio summary based on provided business details.",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const chatGPTData = await chatGPTResponse.json();
      setPortfolioText(chatGPTData.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchBusinessInfo();
    }
  };

  const downloadPDF = () => {
    // Implement PDF generation logic
  };

  const businessSummary = businessData && (
    <div>
      <p className="text-[#666] mb-2">{businessData.snippet}</p>
      <p className="text-[#666]">Source: {businessData.displayLink}</p>
    </div>
  );

  const portfolioGallery = portfolioImages.map((image) => (
    <div key={image.originalImageUrl} className="inline-block mr-2 mb-2">
      <img
        src={image.thumbnailImageUrl}
        alt={image.title}
        width="200"
        height="200"
      />
    </div>
  ));

  const searchButtonDisabled = loading || !search.trim();

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="py-16">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <input
                type="text"
                name="search"
                placeholder="Enter business name or address"
                value={search}
                onChange={handleSearchInputChange}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-[#4e8df5]"
              />
            </div>
            <button
              onClick={handleSearch}
              className={`w-full px-4 py-2 rounded-md font-roboto ${
                searchButtonDisabled
                  ? "bg-[#a4b8d3] cursor-not-allowed"
                  : "bg-[#4e8df5] hover:bg-[#4278cc] text-white"
              }`}
              disabled={searchButtonDisabled}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg">
          <div className="p-6 font-roboto">
            <h2 className="text-lg font-semibold text-[#333] mb-4">
              Business Summary
            </h2>
            {businessSummary}
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 font-roboto">
          <h2 className="text-lg font-semibold text-[#333] mb-4">Portfolio</h2>
          <div className="mb-4">
            <p>{portfolioText}</p>
          </div>
          <div className="mb-6">{portfolioGallery}</div>
          <div>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-[#4e8df5] text-white rounded-md hover:bg-[#4278cc]"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
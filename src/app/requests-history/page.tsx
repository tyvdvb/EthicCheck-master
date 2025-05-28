"use client";
import { AIGenerationDisplay } from "@/components/AIGenerationDisplay/AIGenerationDisplay";
import { Button } from "@/components/Button";
import { RequestHistory } from "@/types/apiResponseTypes";
import { formatGenerationResponse } from "@/utils/generationRequestResult";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const PAGE_LIMIT = 1;

const getHistoryByPage = async (page: number) => {
  const historyResponse = await axios.get<{
    history: RequestHistory[];
    count: number;
  }>(`/api/get-history?page=${page - 1}&limit=${PAGE_LIMIT}`);
  return historyResponse.data;
};

const HistoryEthickCheckDisplay = ({ el }: {el: RequestHistory} ) => {
   return <div  className="m-14">
  <div className="mb-5">
    <h3 style={{ fontSize: "1rem", fontWeight: "bold" }}>
      Site URL:{" "}
    </h3>
    {el.siteUrl}
  </div>
  <div className="mb-5">
    <h3 style={{ fontSize: "1rem", fontWeight: "bold" }}>
      Perplexity Response
    </h3>
    <ul>
      {el.perplexityResponse.map((response, index) =>
        response.content
          .split("###")
          .map((paragraph, index) => (
            <li key={index}>{paragraph}</li>
          ))
      )}
    </ul>
  </div>
</div>
}

const HistoryGenerationDisplay = ({ el }: {el: RequestHistory} ) => {
  const checkRes = el.chatGptResponse[0].content

  if(!checkRes) {
    return null;
  }

  return <AIGenerationDisplay checkResult={formatGenerationResponse(checkRes as string)} />
}

const RequestsHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<RequestHistory[]>([]);

  useEffect(() => {
    getHistoryByPage(page).then((data) => {
      setHistory(data.history);
      setTotal(data.count);
    });
  }, [page]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div>
      {history.length === 0
        ? "No search history"
        : history.map((el, index) => el.siteUrl ? <HistoryEthickCheckDisplay key={index} el={el} /> : <HistoryGenerationDisplay key={index} el={el} />)}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        previousLabel="Prev"
        marginPagesDisplayed={2}
        containerClassName="flex justify-center items-center gap-2 my-4"
        pageClassName="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100"
        activeClassName="bg-blue-500 text-white"
        previousClassName="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100"
        nextClassName="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100"
        breakClassName="text-gray-500"
        disabledClassName="opacity-50 cursor-not-allowed"
        pageCount={Math.ceil(total / PAGE_LIMIT)}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default RequestsHistoryPage;

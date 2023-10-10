// import React from 'react'

import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

const RequestDoctor = () => {
  const location = useLocation();
  const initialResults = location.state ? location.state.data : [];
  const [results, setResults] = useState(initialResults);
  // const [selectedResult, setSelectedResult] = useState(null);
  // const [message, setMessage] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (data) => {
    // データの送信処理
    try {
      await axios.post(
        `${baseURL}/api/notifications`,
        {
          to_user_id: data.selected_result,
          message: data.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer トークンとして追加
          },
        }
      );
      console.log("依頼が完了しました！");
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h3 className="mb-4 text-xl font-bold">検索結果 {results.length} 件</h3>
      <form className="w-3/4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="flex items-center justify-between">
              <div className="flex space-x-4">
                {result.qualification}/ {result.region}/
                {result.areas.map((area, index) => (
                  <div key={index}>{area}</div>
                ))}
              </div>
              <input
                type="radio"
                {...register("selected_result")}
                value={result.id}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            {...register("message")}
            placeholder="メッセージを入力してください"
            className="w-full p-2 rounded border resize-none"
            rows="4"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="shadow-lg bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 transition duration-300 ease-in-out"
          >
            依頼する
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestDoctor
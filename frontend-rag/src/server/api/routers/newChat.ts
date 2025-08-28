import { z } from "zod";
import { file } from "zod/v4";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const newChatRouter = createTRPCRouter({

  // this is of no use because the file upload is handled directly in the client

  // fileUpload : publicProcedure
  //   .input(z.object({
  //     file: z.instanceof(File)
  //   }))
  //   .mutation(async ({ input }) => {
  //     const API_BASE_URL = process.env.API_BASE_URL;
  //     const { file } = input;
  //     // Handle file upload logic here
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await fetch(`${API_BASE_URL}/api/uploadFile`, {
  //       method: "POST",
  //       body: formData,
  //     });
      

  //     if (!response.ok) {
  //       throw new Error("File Processing failed");
  //     }
  //     const json = await response.json();
  //     if(json.success) {
  //       return {
  //         success: true,
  //         message: "File Processed successfully",
  //       };
  //     } else {
  //       throw new Error("File Processing failed");
  //     }
  //   }),

  sendChat: publicProcedure
  .input(z.object({
    question: z.string(),
    fileName: z.string()
  }))
  .mutation(async ({ input }) => {
    const { question, fileName } = input;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/askLLM`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, fileName })
    });
    if (!response.ok) {
      throw new Error("Failed to send chat message");
    }
    const json = await response.json();
    return json.data;
  })

});

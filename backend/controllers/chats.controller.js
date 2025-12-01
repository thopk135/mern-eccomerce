import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/product.model.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm retry
async function generateWithRetry(model, prompt, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (err.status === 503 && i < retries - 1) {
        console.warn(`Model quá tải, thử lại lần ${i + 1}...`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

export const chatWithAi = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Missing input." });
  try {
    const products = await Product.find().lean();
    const productInfo = products
      .map(p => `- ${p.name}: ${p.description} (Giá: ${p.price} USD)`)
      .join("\n");

    const prompt = `
        Bạn là trợ lý bán hàng cho một cửa hàng trực tuyến.
        Hãy trả lời CHỈ dưới dạng text thuần (plain text), 
        không dùng markdown, không dùng ký tự *, -, #, ** hay ký hiệu đặc biệt.
        Hãy trả lời theo các nguyên tắc sau:

        1) Trả lời NGẮN GỌN nhưng ĐẦY ĐỦ Ý.
        2) Tự xuống hàng khi cần để nội dung rõ ràng, dễ đọc.
        3) Nếu câu trả lời có nhiều ý → trình bày từng ý theo dạng dòng, hạn chế viết liền 1 đoạn dài.
        4) Luôn trả lời thân thiện, lịch sự.
        5) Chỉ trả lời dựa trên danh sách sản phẩm bên dưới. Không bịa ra thông tin.
        6) Nếu khách hỏi ngoài phạm vi sản phẩm → trả lời: 
          "Xin lỗi, mình chỉ có thể hỗ trợ các câu hỏi liên quan đến sản phẩm có trong cửa hàng."

        Dưới đây là danh sách sản phẩm hiện có:
        ${productInfo}

        Khách hàng hỏi: "${message}"

        Hãy trả lời NOW:
      `;

    let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let reply;
    try {
      reply = await generateWithRetry(model, prompt, 3, 1000);
    } catch (err) {
      console.warn("Gemini-2.5-flash quá tải, thử fallback sang gemini-1.5-flash");
      // Fallback model nhẹ hơn
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      reply = await generateWithRetry(model, prompt, 3, 1000);
    }

    res.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      reply: "AI hiện đang bận, vui lòng thử lại sau.",
      detail: error.message,
    });
  }
};

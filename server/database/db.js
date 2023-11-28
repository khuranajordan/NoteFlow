import mongoose from "mongoose";

export const Connection = async () => {
  const URL =
    "mongodb+srv://rohankhurana20:Khurana.rohan123@cluster0.k4dlppe.mongodb.net/?retryWrites=true&w=majority";
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connection successful!");
  } catch (error) {
    console.log("Error while connecting to db: ", error);
  }
};

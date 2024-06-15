import axios from "axios";

export const getPlayerList = async () => {
    const res = await axios.get("/api/players")
    return res.data
}
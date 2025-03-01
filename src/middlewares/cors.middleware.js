const whiteList = ["http://localhost:3000", "http://localhost:5500","http://localhost:5501"];
export const allowed = (req, res, next) => {
	const origin = req.header.origin;
	if (!whiteList.includes(origin)) {
		return res.status(403).json({ success: false, message: "Access denied" });
	}
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Acess-Control-Private-Network", "true");
	next();
};

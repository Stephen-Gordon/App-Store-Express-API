const multer = require("multer");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

let storage;

if (process.env.STORAGE_ENGINE == "S3") {
	const s3 = new S3Client({
		region: process.env.MY_AWS_REGION,
		credentials: {
			accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
		},
	});

	storage = multerS3({
		s3: s3,
		bucket: process.env.MY_AWS_BUCKET_NAME,
		contentType: multerS3.AUTO_CONTENT_TYPE,

		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			console.log("multer file", file);
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});
} else {
	storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "public/uploads");
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});
}

const fileFilter = (req, file, cb) => {
	if (!file) {
		req.imageError = "Image not uploaded";
		return cb(null, false);
	} else if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		req.imageError = "Image must be jpg|jpeg|png|gif";
		return cb(null, false);
	} else {
		return cb(null, true);
	}
};

module.exports = multer({ fileFilter, storage });

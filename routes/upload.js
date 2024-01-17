import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express';   

import multer from 'multer';
const router = express.Router();
  

// 파일을 업로드할 폴더를 미리 만들기,
// 또는 아래와 같이 dest 옵션으로 폴더 생성 
 
const upload = multer({
  storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
      destination(req, file, cb) { // 저장 위치
          cb(null, '../cloudType_carpediem_client/public/assets/uploads/profile'); // uploads라는 폴더 안에 저장
      },
      filename: (req, file, cb) => {	// timestamp를 이용해 새로운 파일명 설정
        let num = file.originalname.lastIndexOf(".");   
        let re = file.originalname.substring(num);  
        let imgname = file.originalname.split(".")[0]+"_"+String(Date.now())+re;         
        cb(null, imgname)
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
}); 


// 이미지 업로드 처리
router.post('/', upload.single('attachment'), (req, res) => {
   
  // req.file 는 `image` 라는 필드의 파일 정보입니다.
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
  if (!req.file) {
    return res.status(400).json({ error: '이미지를 업로드해주세요.' });
  }
  
  const imagePath = req.file.path 
  // 여기서 imagePath를 이용해 이미지를 저장하거나 다른 작업을 수행할 수 있습니다.
  return res.json({ success: true, imagePath: imagePath.split('profile\\')[1] });
});

export default router
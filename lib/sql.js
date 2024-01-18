export const sql = {
  // 로그인
  login: `SELECT * FROM user WHERE user_id = ?`,
  // 아아디찾기
  findId: `SELECT user_id FROM user WHERE user_id = ?`,
  // 회원가입
  join: `INSERT INTO user ( 
    user_id,
    user_pw,
    user_name,
    user_birth,
    user_phone,
    user_email,
    role
  )
  VALUES (?, ?, ?, ?, ?, ?, ?);`,

  // 계정
  getAccountList: `SELECT * FROM account WHERE user_id = ?`,
  setAccountCreate: `INSERT INTO account ( user_id, account_name, account_profile ) VALUES (?, ?, ?);`,
  accountNameCheck: `SELECT account_name FROM account WHERE account_name = ?`,
  accountDelete: `DELETE FROM account WHERE user_id = ? AND account_name = ?;`,
  accoutEdit: `UPDATE my_db.account SET account_profile = ?, account_info = ?, account_link = ? WHERE account_name = ?;`,
  
  // 계졍 > 내 프로필 리스트
  getMyProfile: `SELECT * FROM account WHERE account_name = ?;`,
  getMyList: `SELECT list_content_no, list_image FROM list where account_name = ?;` 
}

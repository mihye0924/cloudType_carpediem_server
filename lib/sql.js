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
  getAccount: `SELECT account_name, account_profile FROM account WHERE user_id = ?`,
  accountCreate: `INSERT INTO account ( user_id, account_name, account_profile ) VALUES (?, ?, ?);`,
  accountCheck: `SELECT account_name FROM account WHERE account_name = ?`,
  accountDelete: `DELETE FROM account WHERE user_id = ? AND account_name = ?;`,
  accoutEdit: `UPDATE account SET account_profile = ?, account_info = ?, account_link = ? WHERE account_name = ?;`,
  
  // 계졍 > 내 프로필 리스트
  listProfile: `SELECT * FROM my_db.account WHERE account_name = ?;`, 
  listData: `SELECT * FROM my_db.account a JOIN my_db.list b ON a.account_name = b.account_name WHERE a.account_name = ?;`, 
  listCreate: `INSERT INTO list (account_name, list_image, list_content ) VALUES (?, ?, ?);`
}

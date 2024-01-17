export const sql = {
  // 로그인
  login: `select * from user where user_id = ?`,
  // 아아디찾기
  findId: `select user_id from user where user_id = ?`,
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
  getAccountList: `select * from account where user_id = ?`,
  setAccountCreate: `INSERT INTO account ( user_id, account_name, account_profile ) VALUES (?, ?, ?);`,
  accountNameCheck: `select account_name from account where account_name = ?`,
  accountDelete: `Delete FROM account WHERE user_id = ? AND account_name = ?;`,

  // 계졍 > 내 프로필 리스트
  getAccountMyProfile: `select * from account where account_name = ?;`,
  getAccountMyList: `select list_content_no, list_image from list where account_name = ?;` 
}

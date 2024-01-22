export const sql = {
  // 로그인
  login: `SELECT * FROM user WHERE user_id = ?;`,
  // 로그인 - 아이디 찾기
  loginIdCheck: `SELECT user_name FROM user WHERE user_name = ? AND user_phone = ?;`, 
  // 로그인 - 아이디 인증번호 찾기
  loginIdCertificateCheck: `SELECT user_id FROM user WHERE user_name = ?;`, 
  // 로그인 - 비밀번호 찾기
  loginPwCheck: `SELECT user_id FROM user WHERE user_id = ? AND user_phone = ?;`, 
  // 로그인 - 비밀번호 인증번호 찾기
  loginPwCertificateCheck: `SELECT user_id FROM user WHERE user_id = ?;`, 
  loginPwEdit: `UPDATE user SET user_pw = ? WHERE user_id = ?;`,
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
  // 회원가입 - 중복찾기
  JoinIdCheck: `SELECT user_id FROM user WHERE user_id = ?`, 
  // 계정
  getAccount: `SELECT account_no, account_name, account_profile FROM account WHERE user_id = ?`,
  accountCreate: `INSERT INTO account ( user_id, account_name, account_profile ) VALUES (?, ?, ?);`,
  accountCheck: `SELECT account_name FROM account WHERE account_name = ?`,
  accountDelete: `DELETE account, list FROM account Left JOIN list ON account.account_name = list.account_name
  WHERE user_id = ? AND account.account_name = ?;`,
  accoutEdit: `UPDATE account SET account_profile = ?, account_info = ?, account_link = ? WHERE account_name = ?;`,
  
  // 계졍 > 내 프로필 리스트
  listProfile: `SELECT * FROM account WHERE account_name = ?;`, 
  listData: `SELECT * FROM account a JOIN list b ON a.account_name = b.account_name WHERE a.account_name = ? ORDER BY list_no ASC;`, 
  listDelete: `DELETE FROM list WHERE account_name = ?;`,
  listCreate: `INSERT INTO list (account_name, list_image, list_content ) VALUES (?, ?, ?);`
}

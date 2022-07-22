
const conn = require('./../inc/db');
// const connection = require('../inc/db');

function getBedrooms() {
  // const conn = await connection();
  try {
      const res = conn.query("SELECT * FROM tb_quartos ORDER BY nome_quarto;");
      console.log(res);
      return res.rows;
  } catch (err) {
      throw new Error(err);
  } 
  // finally {
  //     conn.release();
  // }
}

module.exports = getBedrooms;
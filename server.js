const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', game: 'ILLEGAL CHESS' });
});

// ================= CATALOG 50 LÁ BÀI =================
const CARD_CATALOG = [
  // Nhóm 1: Thao túng Tốt (1-10)
  { id: 1, name: 'Bước Nhảy Vọt', group: 'Tốt', rarity: 'Thường', desc: 'Chọn 1 Tốt của bạn tiến thẳng 3 ô nếu không bị cản.' },
  { id: 2, name: 'Tốt Cảm Tử', group: 'Tốt', rarity: 'Hiếm', desc: 'Hy sinh 1 Tốt tiêu diệt 1 Tốt hoặc Mã địch ở ô liền kề (8 hướng).' },
  { id: 3, name: 'Phong Cấp Sớm', group: 'Tốt', rarity: 'Sử Thi', desc: 'Chọn 1 Tốt ở hàng thứ 6 (cách đích 2 ô), phong cấp thành Xe hoặc Mã.' },
  { id: 4, name: 'Bức Tường Thép', group: 'Tốt', rarity: 'Thường', desc: 'Chọn 1 Tốt; bất tử (không thể bị ăn) đến hết lượt tiếp theo của địch.' },
  { id: 5, name: 'Tốt Đi Lùi', group: 'Tốt', rarity: 'Thường', desc: '1 Tốt đi lùi 1 ô thẳng hoặc ăn chéo lùi 1 ô trong lượt này.' },
  { id: 6, name: 'Triệu Hồi Dân Binh', group: 'Tốt', rarity: 'Hiếm', desc: 'Đặt thêm 1 Tốt mới vào ô trống ở hàng thứ 2 của bạn.' },
  { id: 7, name: 'Đội Hình Chữ V', group: 'Tốt', rarity: 'Hiếm', desc: 'Di chuyển cùng lúc 2 Tốt của bạn tiến lên 1 ô nếu phía trước trống.' },
  { id: 8, name: 'Tốt Đột Kích', group: 'Tốt', rarity: 'Thường', desc: '1 Tốt có thể ăn thẳng về phía trước 1 ô trong lượt này.' },
  { id: 9, name: 'Hoán Đổi Tiền Tuyến', group: 'Tốt', rarity: 'Thường', desc: 'Đổi vị trí 2 quân Tốt bất kỳ của bạn trên bàn cờ.' },
  { id: 10, name: 'Tốt Nổ Tung', group: 'Tốt', rarity: 'Sử Thi', desc: 'Khi Tốt này bị địch ăn ở lượt tới, nó kéo theo quân vừa ăn bị loại.' },

  // Nhóm 2: Cường hóa Quân Cờ (11-22)
  { id: 11, name: 'Ngựa Thần Pegasus', group: 'Quân Cờ', rarity: 'Sử Thi', desc: 'Chọn 1 Mã đi 2 nước liên tiếp trong lượt này (không chiếu hết ở nước đầu).' },
  { id: 12, name: 'Tượng Xuyên Thấu', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Chọn 1 Tượng nhảy qua tối đa 1 quân cản đường để ăn quân địch.' },
  { id: 13, name: 'Xe Tăng Thiết Giáp', group: 'Quân Cờ', rarity: 'Sử Thi', desc: 'Chọn 1 Xe húc tiêu diệt quân đầu cản đường và đi tiếp tối đa 2 ô.' },
  { id: 14, name: 'Hậu Bóng Đêm', group: 'Quân Cờ', rarity: 'Huyền Thoại', desc: 'Hậu tàng hình trong 1 lượt (địch không thể ăn Hậu ở lượt tiếp theo).' },
  { id: 15, name: 'Ám Sát Từ Xa', group: 'Quân Cờ', rarity: 'Sử Thi', desc: 'Chọn 1 Tượng hoặc Mã, tiêu diệt 1 Tốt địch bất kỳ không cần di chuyển.' },
  { id: 16, name: 'Dịch Chuyển Tức Thời', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Dịch chuyển 1 Mã của bạn đến ô trống trên nửa bàn cờ của bạn.' },
  { id: 17, name: 'Song Sinh Tượng', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Nếu mất cả 2 Tượng, hồi sinh 1 Tượng tại ô xuất phát nếu trống.' },
  { id: 18, name: 'Pháo Đài Di Động', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Đổi vị trí giữa 1 Xe và 1 Hậu của bạn.' },
  { id: 19, name: 'Cú Đá Hậu Cước', group: 'Quân Cờ', rarity: 'Thường', desc: 'Mã của bạn đi như Xe (tối đa 3 ô) trong lượt này.' },
  { id: 20, name: 'Giam Cầm', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Chọn 1 quân địch (trừ Vua), bị đóng băng không thể đi ở lượt kế tiếp.' },
  { id: 21, name: 'Phản Đòn', group: 'Quân Cờ', rarity: 'Hiếm', desc: 'Gắn bùa lên 1 quân; nếu địch ăn quân này ở lượt tới, quân ăn cũng bị diệt.' },
  { id: 22, name: 'Hồi Sinh Tướng Quân', group: 'Quân Cờ', rarity: 'Huyền Thoại', desc: 'Hồi sinh 1 Mã hoặc Tượng đã mất vào ô trống ở hàng cuối cùng.' },

  // Nhóm 3: Thao túng Vua & Nhập Thành (23-30)
  { id: 23, name: 'Vua Thiết Giáp', group: 'Vua', rarity: 'Sử Thi', desc: 'Vua đi tối đa 2 ô mọi hướng trong lượt này (không ăn Vua địch).' },
  { id: 24, name: 'Nhập Thành Bất Quy Tắc', group: 'Vua', rarity: 'Hiếm', desc: 'Nhập thành kể cả khi Vua/Xe đã di chuyển (đường trống, không qua ô bị chiếu).' },
  { id: 25, name: 'Thế Thân Hoàng Gia', group: 'Vua', rarity: 'Sử Thi', desc: 'Khi Vua đang bị chiếu, đổi chỗ Vua với 1 Tốt bất kỳ của bạn.' },
  { id: 26, name: 'Vùng Cấm Địa', group: 'Vua', rarity: 'Hiếm', desc: 'Chọn 1 ô trống; không quân nào (kể cả Vua) vào ô đó trong 2 lượt tới.' },
  { id: 27, name: 'Uy Quyền Đế Vương', group: 'Vua', rarity: 'Hiếm', desc: 'Đẩy lùi mọi quân địch sát cạnh Vua ra xa thêm 1 ô nếu ô sau đó trống.' },
  { id: 28, name: 'Vua Phản Công', group: 'Vua', rarity: 'Huyền Thoại', desc: 'Vua ăn quân địch kể cả đang được bảo vệ (lượt sau không bị ăn).' },
  { id: 29, name: 'Lá Chắn Hoàng Kim', group: 'Vua', rarity: 'Sử Thi', desc: 'Vua miễn nhiễm mọi trạng thái Chiếu trong 1 lượt của đối thủ.' },
  { id: 30, name: 'Triệu Hồi Cận Vệ', group: 'Vua', rarity: 'Thường', desc: 'Tạo 1 Tốt bảo vệ ở ô trống liền kề Vua của bạn.' },

  // Nhóm 4: Phá vỡ Không gian & Luật chơi (31-40)
  { id: 31, name: 'Đảo Ngược Bàn Cờ', group: 'Không Gian', rarity: 'Sử Thi', desc: 'Hoán đổi vị trí 2 quân cờ bất kỳ của đối thủ (trừ Vua).' },
  { id: 32, name: 'Lỗ Đen Vũ Trụ', group: 'Không Gian', rarity: 'Huyền Thoại', desc: 'Chọn 1 ô trống, hút 8 quân xung quanh (trừ Vua) vào gần tâm hơn 1 ô nếu được.' },
  { id: 33, name: 'Cướp Lượt (Time Stop)', group: 'Không Gian', rarity: 'Huyền Thoại', desc: 'Sau khi đi xong nước này, đi thêm 1 nước nữa (chỉ được di chuyển Tốt).' },
  { id: 34, name: 'Hố Giun Không Gian', group: 'Không Gian', rarity: 'Hiếm', desc: 'Chọn 1 quân ở cột A dịch chuyển sang ô tương ứng ở cột H (và ngược lại).' },
  { id: 35, name: 'Sương Mù Chiến Tranh', group: 'Không Gian', rarity: 'Hiếm', desc: 'Che khuất toàn bộ vị trí Tốt của bạn trên màn hình đối thủ trong 1 lượt.' },
  { id: 36, name: 'Trọng Lực Nặng', group: 'Không Gian', rarity: 'Hiếm', desc: 'Trong lượt tiếp theo của địch, mọi quân của họ chỉ đi tối đa 2 ô.' },
  { id: 37, name: 'Hoán Đổi Linh Hồn', group: 'Không Gian', rarity: 'Sử Thi', desc: 'Đổi vị trí 1 quân của bạn với 1 quân cùng loại của đối thủ.' },
  { id: 38, name: 'Xóa Sổ Ô Cờ', group: 'Không Gian', rarity: 'Huyền Thoại', desc: 'Phá hủy 1 ô trống thành hố sâu vĩnh viễn không quân nào đi/đứng được.' },
  { id: 39, name: 'Quay Ngược Thời Gian', group: 'Không Gian', rarity: 'Sử Thi', desc: 'Hoàn tác (Undo) nước đi vừa rồi của đối thủ, buộc họ đi nước khác.' },
  { id: 40, name: 'Cơn Bão Hỗn Loạn', group: 'Không Gian', rarity: 'Sử Thi', desc: 'Ngẫu nhiên hoán đổi 2 quân cờ bất kỳ trên bàn cờ (trừ Vua).' },

  // Nhóm 5: Tương tác Thẻ Bài & Tâm Lý Chiến (41-50)
  { id: 41, name: 'Soi Bài Đối Thủ', group: 'Tâm Lý', rarity: 'Thường', desc: 'Lật ngửa và cho bạn xem toàn bộ thẻ bài còn lại trên tay đối thủ.' },
  { id: 42, name: 'Đánh Cắp Ý Tưởng', group: 'Tâm Lý', rarity: 'Sử Thi', desc: 'Sao chép ngẫu nhiên 1 lá bài trên tay đối thủ vào tay bạn.' },
  { id: 43, name: 'Phá Hủy Thẻ Bài', group: 'Tâm Lý', rarity: 'Hiếm', desc: 'Tiêu hủy ngẫu nhiên 1 lá bài chưa dùng trên tay đối thủ.' },
  { id: 44, name: 'Khóa Phép (Silence)', group: 'Tâm Lý', rarity: 'Sử Thi', desc: 'Đối thủ không được kích hoạt thẻ bài nào trong lượt tiếp theo của họ.' },
  { id: 45, name: 'Hoán Đổi Bộ Bài', group: 'Tâm Lý', rarity: 'Hiếm', desc: 'Tráo đổi ngẫu nhiên 1 lá bài của bạn lấy 1 lá trên tay đối thủ.' },
  { id: 46, name: 'Tái Chế', group: 'Tâm Lý', rarity: 'Hiếm', desc: 'Lấy lại 1 lá bài bạn đã dùng trước đó trong ván này để dùng lại.' },
  { id: 47, name: 'Bẫy Phản Phép', group: 'Tâm Lý', rarity: 'Sử Thi', desc: 'Đặt bẫy; nếu địch dùng thẻ ở lượt tới, hiệu ứng thẻ đó bị vô hiệu hóa.' },
  { id: 48, name: 'Hiến Tế Lấy Quyền', group: 'Tâm Lý', rarity: 'Hiếm', desc: 'Tự diệt 1 Mã hoặc Tượng của bạn để hồi phục 2 lá bài đã dùng.' },
  { id: 49, name: 'Cược Tất Tay', group: 'Tâm Lý', rarity: 'Huyền Thoại', desc: 'Vô hiệu hóa toàn bộ thẻ bài còn lại của cả 2 người trong phần còn lại của ván.' },
  { id: 50, name: 'Thẩm Phán Tối Cao', group: 'Tâm Lý', rarity: 'Huyền Thoại', desc: 'Nếu ít hơn địch từ 3 quân trở lên, diệt 1 quân mạnh nhất của địch (trừ Vua).' }
];

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function createInitialBoard() {
  // board[r][c], r: 0 (hàng 8 - Đen) -> 7 (hàng 1 - Trắng), c: 0..7 (a..h)
  const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  let pid = 1;

  for (let c = 0; c < 8; c++) {
    board[0][c] = { id: `b_${pid++}`, type: backRank[c], color: 'b', moved: false };
    board[1][c] = { id: `b_${pid++}`, type: 'p', color: 'b', moved: false };
    board[6][c] = { id: `w_${pid++}`, type: 'p', color: 'w', moved: false };
    board[7][c] = { id: `w_${pid++}`, type: 'r', color: 'w', moved: false };
  }
  // Đặt lại hàng 7 cho Trắng đúng thứ tự chuẩn
  const whiteBack = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  for (let c = 0; c < 8; c++) {
    board[7][c] = { id: `w_back_${c}`, type: whiteBack[c], color: 'w', moved: false };
  }

  return board;
}

function cloneBoard(board) {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

function createRoundState(room) {
  // Xác định màu quân theo ván (Ván 1: P1 Trắng, P2 Đen; Ván 2: đảo ngược; Ván 3: P1 Trắng, P2 Đen)
  const swapColors = room.roundNumber % 2 === 0;
  const p1Color = swapColors ? 'b' : 'w';
  const p2Color = swapColors ? 'w' : 'b';

  const p1Deck = (room.players[0]?.deck || [1, 11, 23, 33, 41]).slice(0, 5);
  const p2Deck = (room.players[1]?.deck || [2, 12, 24, 34, 42]).slice(0, 5);

  return {
    board: createInitialBoard(),
    turn: 'w', // Trắng luôn đi trước
    moveNumber: 1,
    cardPlayedThisTurn: false,
    extraPawnTurnFor: null, // Thẻ 33: Cướp Lượt
    lastSnapshot: null, // Thẻ 39: Quay Ngược Thời Gian
    lastMoveSummary: 'Ván đấu bắt đầu! Trắng đi trước.',
    winnerColor: null,
    winReason: null,
    voidSquares: [], // Thẻ 38: [{ r, c }]
    forbiddenZones: [], // Thẻ 26: [{ r, c, turnsLeft, ownerColor }]
    effects: {
      w: {
        pawnImmortalIds: [], // Thẻ 4: { pieceId, untilEnemyTurnEnd }
        pawnExplosiveIds: [], // Thẻ 10: pieceId
        queenStealthTurns: 0, // Thẻ 14
        counterWardPieceIds: [], // Thẻ 21
        kingDoubleStepTurns: 0, // Thẻ 23
        kingCheckImmuneTurns: 0, // Thẻ 29
        kingCounterAttackTurns: 0, // Thẻ 28
        fogOfWarTurns: 0, // Thẻ 35
        heavyGravityTurns: 0, // Thẻ 36
        frozenPieceIds: [], // Thẻ 20
        silenceTurns: 0, // Thẻ 44
        counterSpellArmed: false, // Thẻ 47
        cardsDisabledPermanent: false, // Thẻ 49
        pegasusCharges: 0, // Thẻ 11
        bishopPierceTurns: 0, // Thẻ 12
        rookRamTurns: 0, // Thẻ 13
        knightAsRookTurns: 0, // Thẻ 19
        pawnBackwardTurns: 0, // Thẻ 5
        pawnForwardCaptureTurns: 0 // Thẻ 8
      },
      b: {
        pawnImmortalIds: [],
        pawnExplosiveIds: [],
        queenStealthTurns: 0,
        counterWardPieceIds: [],
        kingDoubleStepTurns: 0,
        kingCheckImmuneTurns: 0,
        kingCounterAttackTurns: 0,
        fogOfWarTurns: 0,
        heavyGravityTurns: 0,
        frozenPieceIds: [],
        silenceTurns: 0,
        counterSpellArmed: false,
        cardsDisabledPermanent: false,
        pegasusCharges: 0,
        bishopPierceTurns: 0,
        rookRamTurns: 0,
        knightAsRookTurns: 0,
        pawnBackwardTurns: 0,
        pawnForwardCaptureTurns: 0
      }
    },
    playerCards: {
      [p1Color]: p1Deck.map((cardId, idx) => ({ uid: `${p1Color}_${room.roundNumber}_${idx}_${cardId}`, cardId, used: false })),
      [p2Color]: p2Deck.map((cardId, idx) => ({ uid: `${p2Color}_${room.roundNumber}_${idx}_${cardId}`, cardId, used: false }))
    },
    capturedBy: { w: [], b: [] }
  };
}

function createRoom(code, hostSocket, hostName, hostDeck) {
  return {
    code,
    players: [
      {
        socketId: hostSocket.id,
        name: hostName || 'Người Chơi 1',
        deck: hostDeck,
        connected: true
      }
    ],
    roundNumber: 1,
    scores: { p1: 0, p2: 0 }, // p1 = players[0], p2 = players[1]
    matchWinner: null,
    round: null
  };
}

function getPlayerSlot(room, socketId) {
  if (room.players[0]?.socketId === socketId) return 0;
  if (room.players[1]?.socketId === socketId) return 1;
  return -1;
}

function getPlayerColor(room, socketId) {
  const slot = getPlayerSlot(room, socketId);
  if (slot === -1 || !room.round) return null;
  const swapColors = room.roundNumber % 2 === 0;
  if (slot === 0) return swapColors ? 'b' : 'w';
  return swapColors ? 'w' : 'b';
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function isVoidSquare(round, r, c) {
  return round.voidSquares.some(s => s.r === r && s.c === c);
}

function isForbiddenSquare(round, r, c) {
  return round.forbiddenZones.some(z => z.r === r && z.c === c && z.turnsLeft > 0);
}

function isPawnImmortal(round, color, pieceId) {
  return round.effects[color].pawnImmortalIds.some(x => x.pieceId === pieceId);
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color && p.type === 'k') return { r, c, piece: p };
    }
  }
  return null;
}

function isKingInCheck(round, kingColor) {
  const kingPos = findKing(round.board, kingColor);
  if (!kingPos) return false;
  if (round.effects[kingColor].kingCheckImmuneTurns > 0) return false;

  const enemy = kingColor === 'w' ? 'b' : 'w';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = round.board[r][c];
      if (!p || p.color !== enemy) continue;
      if (canPieceThreatenSquare(round, r, c, kingPos.r, kingPos.c)) {
        return true;
      }
    }
  }
  return false;
}

function canPieceThreatenSquare(round, fr, fc, tr, tc) {
  const p = round.board[fr][fc];
  if (!p) return false;
  if (isVoidSquare(round, tr, tc)) return false;
  if (isForbiddenSquare(round, tr, tc)) return false;
  if (p.type === 'q' && round.effects[p.color].queenStealthTurns > 0) return false;

  const dr = tr - fr;
  const dc = tc - fc;
  const adr = Math.abs(dr);
  const adc = Math.abs(dc);

  if (p.type === 'p') {
    const dir = p.color === 'w' ? -1 : 1;
    if (dr === dir && adc === 1) return true;
    if (round.effects[p.color].pawnForwardCaptureTurns > 0 && dr === dir && dc === 0) return true;
    if (round.effects[p.color].pawnBackwardTurns > 0 && dr === -dir && adc === 1) return true;
    return false;
  }

  if (p.type === 'n') {
    return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
  }

  if (p.type === 'k') {
    return adr <= 1 && adc <= 1 && (adr + adc > 0);
  }

  const stepR = dr === 0 ? 0 : dr / adr;
  const stepC = dc === 0 ? 0 : dc / adc;

  if (p.type === 'b' || p.type === 'q') {
    if (adr === adc && adr > 0) {
      let blockers = 0;
      let cr = fr + stepR;
      let cc = fc + stepC;
      while (cr !== tr || cc !== tc) {
        if (round.board[cr][cc]) blockers++;
        cr += stepR;
        cc += stepC;
      }
      if (p.type === 'b' && round.effects[p.color].bishopPierceTurns > 0) {
        return blockers <= 1;
      }
      return blockers === 0;
    }
  }

  if (p.type === 'r' || p.type === 'q') {
    if ((dr === 0 || dc === 0) && (adr + adc > 0)) {
      let blockers = 0;
      let cr = fr + stepR;
      let cc = fc + stepC;
      while (cr !== tr || cc !== tc) {
        if (round.board[cr][cc]) blockers++;
        cr += stepR;
        cc += stepC;
      }
      return blockers === 0;
    }
  }

  return false;
}

function isLegalNormalMove(round, color, fr, fc, tr, tc, allowIllegalOverrides = true) {
  if (!inBounds(fr, fc) || !inBounds(tr, tc)) return false;
  if (fr === tr && fc === tc) return false;
  if (isVoidSquare(round, tr, tc)) return false;
  if (isForbiddenSquare(round, tr, tc)) return false;

  const piece = round.board[fr][fc];
  if (!piece || piece.color !== color) return false;

  // Thẻ 33: Cướp Lượt ở nước thứ 2 chỉ được di chuyển Tốt
  if (round.extraPawnTurnFor === color && piece.type !== 'p') {
    return false;
  }

  // Thẻ 20: Giam Cầm
  if (round.effects[color].frozenPieceIds.includes(piece.id)) {
    return false;
  }

  const target = round.board[tr][tc];
  if (target && target.color === color) {
    // Cho phép nhập thành chuẩn (Vua + Xe cùng màu, chưa di chuyển)
    if (piece.type === 'k' && target.type === 'r' && !piece.moved && !target.moved && fr === tr) {
      const minC = Math.min(fc, tc);
      const maxC = Math.max(fc, tc);
      for (let c = minC + 1; c < maxC; c++) {
        if (round.board[fr][c] || isVoidSquare(round, fr, c)) return false;
      }
      return true;
    }
    return false;
  }

  // Không thể ăn Vua trực tiếp trong nước cờ thường
  if (target && target.type === 'k') return false;

  // Bất tử Tốt (Thẻ 4)
  if (target && target.type === 'p' && isPawnImmortal(round, target.color, target.id)) {
    return false;
  }

  // Hậu Bóng Đêm (Thẻ 14) - không thể ăn Hậu đang tàng hình
  if (target && target.type === 'q' && round.effects[target.color].queenStealthTurns > 0) {
    return false;
  }

  // Vua Phản Công (Thẻ 28): nếu target đang được quân địch bảo vệ, bình thường Vua không ăn được; nhưng có thẻ 28 thì được ăn
  if (piece.type === 'k' && target && allowIllegalOverrides) {
    const enemy = color === 'w' ? 'b' : 'w';
    const protectedByEnemy = hasFriendlyProtector(round, enemy, tr, tc, fr, fc);
    if (protectedByEnemy && round.effects[color].kingCounterAttackTurns <= 0) {
      return false;
    }
  }

  const dr = tr - fr;
  const dc = tc - fc;
  const adr = Math.abs(dr);
  const adc = Math.abs(dc);
  const eff = round.effects[color];
  const maxStepLimit = eff.heavyGravityTurns > 0 ? 2 : 8;

  if (piece.type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;

    // Tiến thẳng 1 ô
    if (dc === 0 && dr === dir && !target) return true;

    // Tiến thẳng 2 ô từ hàng xuất phát
    if (dc === 0 && dr === 2 * dir && fr === startRow && !target && !round.board[fr + dir][fc]) {
      return true;
    }

    // Thẻ 8: Tốt Đột Kích (ăn thẳng 1 ô)
    if (allowIllegalOverrides && eff.pawnForwardCaptureTurns > 0 && dc === 0 && dr === dir && target) {
      return true;
    }

    // Ăn chéo 1 ô
    if (adc === 1 && dr === dir && target) return true;

    // Thẻ 5: Tốt Đi Lùi (lùi 1 ô thẳng hoặc ăn chéo lùi 1 ô)
    if (allowIllegalOverrides && eff.pawnBackwardTurns > 0) {
      if (dc === 0 && dr === -dir && !target) return true;
      if (adc === 1 && dr === -dir && target) return true;
    }

    return false;
  }

  if (piece.type === 'n') {
    // Thẻ 19: Cú Đá Hậu Cước (Mã đi như Xe tối đa 3 ô)
    if (allowIllegalOverrides && eff.knightAsRookTurns > 0 && (dr === 0 || dc === 0) && (adr + adc) >= 1 && (adr + adc) <= Math.min(3, maxStepLimit)) {
      const stepR = dr === 0 ? 0 : dr / adr;
      const stepC = dc === 0 ? 0 : dc / adc;
      let cr = fr + stepR;
      let cc = fc + stepC;
      while (cr !== tr || cc !== tc) {
        if (round.board[cr][cc]) return false;
        cr += stepR;
        cc += stepC;
      }
      return true;
    }
    return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
  }

  if (piece.type === 'k') {
    const maxKingStep = (allowIllegalOverrides && eff.kingDoubleStepTurns > 0) ? 2 : 1;
    if (adr <= maxKingStep && adc <= maxKingStep && (adr + adc > 0)) {
      // Nếu đi 2 ô theo đường thẳng/chéo, kiểm tra ô giữa không bị chặn
      if (adr === 2 || adc === 2) {
        const stepR = dr === 0 ? 0 : dr / adr;
        const stepC = dc === 0 ? 0 : dc / adc;
        const midR = fr + stepR;
        const midC = fc + stepC;
        if (round.board[midR][midC] || isVoidSquare(round, midR, midC) || isForbiddenSquare(round, midR, midC)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  // Tượng, Xe, Hậu
  const stepR = dr === 0 ? 0 : dr / adr;
  const stepC = dc === 0 ? 0 : dc / adc;

  if (piece.type === 'b') {
    if (adr !== adc || adr === 0) return false;
    if (adr > maxStepLimit) return false;

    let blockers = 0;
    let cr = fr + stepR;
    let cc = fc + stepC;
    while (cr !== tr || cc !== tc) {
      if (round.board[cr][cc]) blockers++;
      cr += stepR;
      cc += stepC;
    }

    // Thẻ 12: Tượng Xuyên Thấu (nhảy qua tối đa 1 quân cản để ăn quân địch)
    if (allowIllegalOverrides && eff.bishopPierceTurns > 0 && target) {
      return blockers <= 1;
    }
    return blockers === 0;
  }

  if (piece.type === 'r') {
    if ((dr !== 0 && dc !== 0) || (adr + adc === 0)) return false;
    const dist = adr + adc;

    // Thẻ 13: Xe Tăng Thiết Giáp (húc quân đầu cản đường và đi tiếp tối đa 2 ô)
    if (allowIllegalOverrides && eff.rookRamTurns > 0) {
      if (dist > Math.min(maxStepLimit, 8)) return false;
      let blockers = [];
      let cr = fr + stepR;
      let cc = fc + stepC;
      while (cr !== tr || cc !== tc) {
        if (round.board[cr][cc]) blockers.push({ r: cr, c: cc, p: round.board[cr][cc] });
        cr += stepR;
        cc += stepC;
      }
      if (blockers.length === 0) return true;
      if (blockers.length === 1) {
        const b = blockers[0];
        if (b.p.type === 'k' || b.p.color === color) return false;
        if (b.p.type === 'p' && isPawnImmortal(round, b.p.color, b.p.id)) return false;
        const afterDist = Math.abs(tr - b.r) + Math.abs(tc - b.c);
        return afterDist <= 2;
      }
      return false;
    }

    if (dist > maxStepLimit) return false;
    let cr = fr + stepR;
    let cc = fc + stepC;
    while (cr !== tr || cc !== tc) {
      if (round.board[cr][cc]) return false;
      cr += stepR;
      cc += stepC;
    }
    return true;
  }

  if (piece.type === 'q') {
    const isDiag = adr === adc && adr > 0;
    const isOrtho = (dr === 0 || dc === 0) && (adr + adc > 0);
    if (!isDiag && !isOrtho) return false;
    const dist = Math.max(adr, adc);
    if (dist > maxStepLimit) return false;

    let cr = fr + stepR;
    let cc = fc + stepC;
    while (cr !== tr || cc !== tc) {
      if (round.board[cr][cc]) return false;
      cr += stepR;
      cc += stepC;
    }
    return true;
  }

  return false;
}

function hasFriendlyProtector(round, defenderColor, tr, tc, ignoreR, ignoreC) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === ignoreR && c === ignoreC) continue;
      const p = round.board[r][c];
      if (!p || p.color !== defenderColor) continue;
      if (canPieceThreatenSquare(round, r, c, tr, tc)) return true;
    }
  }
  return false;
}

function advanceTurn(room) {
  const r = room.round;
  const prevColor = r.turn;
  const nextColor = prevColor === 'w' ? 'b' : 'w';

  // Giảm thời gian hiệu ứng của bên vừa kết thúc lượt
  const prevEff = r.effects[prevColor];
  prevEff.pawnImmortalIds = prevEff.pawnImmortalIds
    .map(item => ({ ...item, turnsLeft: item.turnsLeft - 1 }))
    .filter(item => item.turnsLeft > 0);

  if (prevEff.queenStealthTurns > 0) prevEff.queenStealthTurns--;
  if (prevEff.kingDoubleStepTurns > 0) prevEff.kingDoubleStepTurns--;
  if (prevEff.kingCheckImmuneTurns > 0) prevEff.kingCheckImmuneTurns--;
  if (prevEff.kingCounterAttackTurns > 0) prevEff.kingCounterAttackTurns--;
  if (prevEff.fogOfWarTurns > 0) prevEff.fogOfWarTurns--;
  if (prevEff.heavyGravityTurns > 0) prevEff.heavyGravityTurns--;
  if (prevEff.silenceTurns > 0) prevEff.silenceTurns--;
  if (prevEff.bishopPierceTurns > 0) prevEff.bishopPierceTurns--;
  if (prevEff.rookRamTurns > 0) prevEff.rookRamTurns--;
  if (prevEff.knightAsRookTurns > 0) prevEff.knightAsRookTurns--;
  if (prevEff.pawnBackwardTurns > 0) prevEff.pawnBackwardTurns--;
  if (prevEff.pawnForwardCaptureTurns > 0) prevEff.pawnForwardCaptureTurns--;
  prevEff.frozenPieceIds = [];

  // Vùng Cấm Địa (Thẻ 26)
  r.forbiddenZones = r.forbiddenZones
    .map(z => ({ ...z, turnsLeft: z.turnsLeft - 1 }))
    .filter(z => z.turnsLeft > 0);

  r.turn = nextColor;
  r.moveNumber++;
  r.cardPlayedThisTurn = false;
  r.extraPawnTurnFor = null;
}

function checkRoundEnd(room) {
  const r = room.round;
  if (r.winnerColor) return true;

  const wKing = findKing(r.board, 'w');
  const bKing = findKing(r.board, 'b');

  if (!wKing && !bKing) {
    r.winnerColor = 'draw';
    r.winReason = 'Hòa cờ (Cả hai Vua đều thất thủ)';
  } else if (!wKing) {
    r.winnerColor = 'b';
    r.winReason = 'Vua Trắng bị tiêu diệt! Đen thắng ván này.';
  } else if (!bKing) {
    r.winnerColor = 'w';
    r.winReason = 'Vua Đen bị tiêu diệt! Trắng thắng ván này.';
  }

  if (!r.winnerColor) return false;

  // Cộng điểm BO3
  const swapColors = room.roundNumber % 2 === 0;
  const p1Color = swapColors ? 'b' : 'w';
  const p2Color = swapColors ? 'w' : 'b';

  if (r.winnerColor === 'draw') {
    room.scores.p1 += 0.5;
    room.scores.p2 += 0.5;
  } else if (r.winnerColor === p1Color) {
    room.scores.p1 += 1;
  } else if (r.winnerColor === p2Color) {
    room.scores.p2 += 1;
  }

  if (room.scores.p1 >= 2) {
    room.matchWinner = 'p1';
  } else if (room.scores.p2 >= 2) {
    room.matchWinner = 'p2';
  } else if (room.roundNumber >= 3) {
    if (room.scores.p1 > room.scores.p2) room.matchWinner = 'p1';
    else if (room.scores.p2 > room.scores.p1) room.matchWinner = 'p2';
    else room.matchWinner = 'draw';
  }

  return true;
}

function sanitizeRoundForPlayer(room, color) {
  const r = room.round;
  if (!r) return null;

  const enemyColor = color === 'w' ? 'b' : 'w';
  const boardView = cloneBoard(r.board);

  // Thẻ 35: Sương Mù Chiến Tranh (ẩn Tốt của đối thủ trên bàn cờ của mình)
  if (r.effects[enemyColor].fogOfWarTurns > 0) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const p = boardView[row][col];
        if (p && p.color === enemyColor && p.type === 'p') {
          boardView[row][col] = { id: p.id, type: 'fog', color: enemyColor, moved: false };
        }
      }
    }
  }

  const myCards = r.playerCards[color] || [];
  const enemyCardsRaw = r.playerCards[enemyColor] || [];

  // Thẻ 41: Soi Bài Đối Thủ (nếu color đã dùng thẻ 41 thì thấy bài đối thủ)
  const revealedEnemy = r.revealedEnemyCardsTo?.[color] === true;
  const enemyCards = enemyCardsRaw.map(c => ({
    uid: c.uid,
    used: c.used,
    cardId: revealedEnemy ? c.cardId : null
  }));

  return {
    board: boardView,
    turn: r.turn,
    moveNumber: r.moveNumber,
    cardPlayedThisTurn: r.cardPlayedThisTurn,
    extraPawnTurnFor: r.extraPawnTurnFor,
    lastMoveSummary: r.lastMoveSummary,
    winnerColor: r.winnerColor,
    winReason: r.winReason,
    voidSquares: r.voidSquares,
    forbiddenZones: r.forbiddenZones,
    myCards,
    enemyCardsCount: enemyCardsRaw.filter(c => !c.used).length,
    enemyCards,
    myEffects: r.effects[color],
    enemyEffects: r.effects[enemyColor],
    inCheck: isKingInCheck(r, color)
  };
}

function broadcastRoomState(room) {
  room.players.forEach((p, idx) => {
    if (!p.connected) return;
    const swapColors = room.roundNumber % 2 === 0;
    const color = idx === 0 ? (swapColors ? 'b' : 'w') : (swapColors ? 'w' : 'b');
    io.to(p.socketId).emit('room_state', {
      code: room.code,
      roundNumber: room.roundNumber,
      scores: room.scores,
      matchWinner: room.matchWinner,
      mySlot: idx,
      myColor: color,
      players: room.players.map((pl, i) => ({
        name: pl.name,
        connected: pl.connected,
        slot: i
      })),
      round: sanitizeRoundForPlayer(room, color)
    });
  });
}

function executeNormalMove(room, color, payload) {
  const r = room.round;
  const { from, to, promotionChoice } = payload;
  if (!from || !to) return { ok: false, error: 'Thiếu tọa độ nước đi.' };

  const piece = r.board[from.r]?.[from.c];
  if (!piece || piece.color !== color) return { ok: false, error: 'Không có quân hợp lệ tại ô xuất phát.' };

  // Lưu snapshot cho Thẻ 39: Quay Ngược Thời Gian
  r.lastSnapshot = {
    board: cloneBoard(r.board),
    turn: r.turn,
    moveNumber: r.moveNumber,
    effects: JSON.parse(JSON.stringify(r.effects)),
    voidSquares: JSON.parse(JSON.stringify(r.voidSquares)),
    forbiddenZones: JSON.parse(JSON.stringify(r.forbiddenZones))
  };

  const target = r.board[to.r][to.c];

  // Xử lý Nhập Thành chuẩn nếu click vào Xe cùng màu
  if (piece.type === 'k' && target && target.color === color && target.type === 'r') {
    const dir = to.c > from.c ? 1 : -1;
    const kingDestC = from.c + dir * 2;
    const rookDestC = kingDestC - dir;
    r.board[from.r][from.c] = null;
    r.board[to.r][to.c] = null;
    r.board[from.r][kingDestC] = { ...piece, moved: true };
    r.board[to.r][rookDestC] = { ...target, moved: true };
    r.lastMoveSummary = `${color === 'w' ? 'Trắng' : 'Đen'} nhập thành!`;
  } else {
    // Thẻ 13: Xe Tăng Thiết Giáp - tiêu diệt quân cản đường đầu tiên nếu có
    if (piece.type === 'r' && r.effects[color].rookRamTurns > 0) {
      const dr = to.r - from.r;
      const dc = to.c - from.c;
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;
      let cr = from.r + stepR;
      let cc = from.c + stepC;
      while (cr !== to.r || cc !== to.c) {
        if (r.board[cr][cc]) {
          r.capturedBy[color].push(r.board[cr][cc]);
          r.board[cr][cc] = null;
          break;
        }
        cr += stepR;
        cc += stepC;
      }
    }

    // Xử lý ăn quân nếu có
    if (target) {
      const targetColor = target.color;
      r.capturedBy[color].push(target);

      // Thẻ 10: Tốt Nổ Tung - kéo theo quân vừa ăn bị loại khỏi bàn cờ
      if (target.type === 'p' && r.effects[targetColor].pawnExplosiveIds.includes(target.id)) {
        r.board[from.r][from.c] = null;
        r.board[to.r][to.c] = null;
        r.capturedBy[targetColor].push(piece);
        r.effects[targetColor].pawnExplosiveIds = r.effects[targetColor].pawnExplosiveIds.filter(id => id !== target.id);
        r.lastMoveSummary = `BOOM! Tốt Nổ Tung kéo theo ${piece.type.toUpperCase()} của ${color === 'w' ? 'Trắng' : 'Đen'}!`;
        finishAfterMove(room, color);
        return { ok: true };
      }

      // Thẻ 21: Phản Đòn - nếu địch ăn quân gắn bùa, quân ăn cũng bị tiêu diệt (trừ Vua)
      if (r.effects[targetColor].counterWardPieceIds.includes(target.id)) {
        r.effects[targetColor].counterWardPieceIds = r.effects[targetColor].counterWardPieceIds.filter(id => id !== target.id);
        if (piece.type !== 'k') {
          r.board[from.r][from.c] = null;
          r.board[to.r][to.c] = null;
          r.capturedBy[targetColor].push(piece);
          r.lastMoveSummary = `PHẢN ĐÒN! Quân ăn bị tiêu diệt bởi bùa phản đòn!`;
          finishAfterMove(room, color);
          return { ok: true };
        }
      }
    }

    r.board[from.r][from.c] = null;
    const movedPiece = { ...piece, moved: true };

    // Phong cấp Tốt khi chạm hàng cuối
    if (movedPiece.type === 'p' && (to.r === 0 || to.r === 7)) {
      const validPromo = ['q', 'r', 'b', 'n'].includes(promotionChoice) ? promotionChoice : 'q';
      movedPiece.type = validPromo;
    }

    r.board[to.r][to.c] = movedPiece;
    const colLabel = 'abcdefgh'[to.c];
    const rowLabel = 8 - to.r;
    r.lastMoveSummary = `${color === 'w' ? 'Trắng' : 'Đen'} đi ${piece.type.toUpperCase()} tới ${colLabel}${rowLabel}${target ? ' (ăn quân)' : ''}.`;
  }

  finishAfterMove(room, color);
  return { ok: true };
}

function finishAfterMove(room, color) {
  const r = room.round;
  if (checkRoundEnd(room)) return;

  // Thẻ 11: Ngựa Thần Pegasus (đi 2 nước liên tiếp)
  if (r.effects[color].pegasusCharges > 0) {
    r.effects[color].pegasusCharges--;
    r.lastMoveSummary += ' (Ngựa Thần Pegasus: còn 1 bước đi nữa!)';
    return;
  }

  // Thẻ 33: Cướp Lượt (sau khi đi xong nước thường, được đi thêm 1 nước chỉ cho Tốt)
  if (r.extraPawnTurnFor === null && r.pendingTimeStopFor === color) {
    r.pendingTimeStopFor = null;
    r.extraPawnTurnFor = color;
    r.lastMoveSummary += ' (CƯỚP LƯỢT! Bạn được đi thêm 1 nước bằng Tốt!)';
    return;
  }

  advanceTurn(room);
  checkRoundEnd(room);
}

function applyCardEffect(room, color, cardUid, targetData = {}) {
  const r = room.round;
  const enemy = color === 'w' ? 'b' : 'w';
  const eff = r.effects[color];
  const enemyEff = r.effects[enemy];

  if (r.turn !== color) return { ok: false, error: 'Chưa tới lượt của bạn!' };
  if (eff.cardsDisabledPermanent) return { ok: false, error: 'Thẻ bài đã bị vô hiệu hóa vĩnh viễn ở ván này (Cược Tất Tay)!' };
  if (eff.silenceTurns > 0) return { ok: false, error: 'Bạn đang bị Khóa Phép (Silence) trong lượt này!' };
  if (r.cardPlayedThisTurn) return { ok: false, error: 'Mỗi lượt chỉ được dùng tối đa 1 lá bài!' };

  const hand = r.playerCards[color];
  const cardSlot = hand.find(c => c.uid === cardUid);
  if (!cardSlot || cardSlot.used) return { ok: false, error: 'Lá bài không khả dụng hoặc đã sử dụng.' };

  const cardId = cardSlot.cardId;
  const cardMeta = CARD_CATALOG.find(c => c.id === cardId);

  // Kiểm tra Bẫy Phản Phép (Thẻ 47) của đối thủ
  if (enemyEff.counterSpellArmed) {
    enemyEff.counterSpellArmed = false;
    cardSlot.used = true;
    r.cardPlayedThisTurn = true;
    r.lastMoveSummary = `BẪY PHẢN PHÉP! Lá "${cardMeta.name}" của ${color === 'w' ? 'Trắng' : 'Đen'} bị vô hiệu hóa hoàn toàn!`;
    return { ok: true };
  }

  const dir = color === 'w' ? -1 : 1;

  // Thực thi từng lá từ 1 đến 50
  switch (cardId) {
    case 1: {
      // Bước Nhảy Vọt: Chọn 1 Tốt tiến thẳng 3 ô nếu không bị cản
      const { r: pr, c: pc } = targetData.pos || {};
      const p = r.board[pr]?.[pc];
      if (!p || p.color !== color || p.type !== 'p') return { ok: false, error: 'Hãy chọn 1 quân Tốt của bạn.' };
      const tr = pr + 3 * dir;
      if (!inBounds(tr, pc)) return { ok: false, error: 'Tốt không đủ 3 ô phía trước.' };
      for (let step = 1; step <= 3; step++) {
        const sr = pr + step * dir;
        if (r.board[sr][pc] || isVoidSquare(r, sr, pc) || isForbiddenSquare(r, sr, pc)) {
          return { ok: false, error: 'Đường tiến 3 ô bị cản hoặc cấm đi.' };
        }
      }
      r.board[pr][pc] = null;
      r.board[tr][pc] = { ...p, moved: true };
      r.lastMoveSummary = `${cardMeta.name}: Tốt nhảy vọt 3 ô tới ${'abcdefgh'[pc]}${8 - tr}!`;
      advanceTurn(room);
      break;
    }

    case 2: {
      // Tốt Cảm Tử: Hy sinh 1 Tốt tiêu diệt 1 Tốt hoặc Mã địch ở ô liền kề (8 hướng)
      const { pawnPos, enemyPos } = targetData;
      const p = r.board[pawnPos?.r]?.[pawnPos?.c];
      const ep = r.board[enemyPos?.r]?.[enemyPos?.c];
      if (!p || p.color !== color || p.type !== 'p') return { ok: false, error: 'Chọn Tốt của bạn.' };
      if (!ep || ep.color !== enemy || !['p', 'n'].includes(ep.type)) return { ok: false, error: 'Chọn Tốt hoặc Mã địch liền kề.' };
      if (Math.abs(pawnPos.r - enemyPos.r) > 1 || Math.abs(pawnPos.c - enemyPos.c) > 1) {
        return { ok: false, error: 'Mục tiêu địch phải nằm ở ô liền kề.' };
      }
      r.capturedBy[color].push(ep);
      r.capturedBy[enemy].push(p);
      r.board[pawnPos.r][pawnPos.c] = null;
      r.board[enemyPos.r][enemyPos.c] = null;
      r.lastMoveSummary = `${cardMeta.name}: Tốt cảm tử tiêu diệt ${ep.type.toUpperCase()} địch!`;
      advanceTurn(room);
      break;
    }

    case 3: {
      // Phong Cấp Sớm: Chọn 1 Tốt ở hàng thứ 6 (cách đích 2 ô), phong cấp thành Xe hoặc Mã
      const { pos, promoType } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      const sixthRowForPlayer = color === 'w' ? 2 : 5; // hàng 6 theo cách đếm từ phía người chơi
      if (!p || p.color !== color || p.type !== 'p' || pos.r !== sixthRowForPlayer) {
        return { ok: false, error: 'Chọn 1 Tốt của bạn đang đứng ở hàng thứ 6 (cách đích 2 ô).' };
      }
      if (!['r', 'n'].includes(promoType)) return { ok: false, error: 'Chỉ được phong cấp thành Xe (r) hoặc Mã (n).' };
      r.board[pos.r][pos.c] = { ...p, type: promoType };
      r.lastMoveSummary = `${cardMeta.name}: Phong cấp sớm Tốt thành ${promoType === 'r' ? 'Xe' : 'Mã'}!`;
      break;
    }

    case 4: {
      // Bức Tường Thép: Chọn 1 Tốt bất tử đến hết lượt tiếp theo của địch
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color || p.type !== 'p') return { ok: false, error: 'Chọn 1 Tốt của bạn.' };
      eff.pawnImmortalIds.push({ pieceId: p.id, turnsLeft: 2 });
      r.lastMoveSummary = `${cardMeta.name}: Tốt tại ${'abcdefgh'[pos.c]}${8 - pos.r} được bọc thép bất tử!`;
      break;
    }

    case 5: {
      // Tốt Đi Lùi: 1 Tốt đi lùi 1 ô thẳng hoặc ăn chéo lùi 1 ô trong lượt này
      eff.pawnBackwardTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Tốt của bạn có thể đi lùi hoặc ăn chéo lùi trong lượt này!`;
      break;
    }

    case 6: {
      // Triệu Hồi Dân Binh: Đặt thêm 1 Tốt mới vào ô trống ở hàng thứ 2 của bạn
      const { pos } = targetData;
      const secondRow = color === 'w' ? 6 : 1;
      if (!inBounds(pos?.r, pos?.c) || pos.r !== secondRow) return { ok: false, error: 'Chọn ô trống ở hàng thứ 2 của bạn.' };
      if (r.board[pos.r][pos.c] || isVoidSquare(r, pos.r, pos.c) || isForbiddenSquare(r, pos.r, pos.c)) {
        return { ok: false, error: 'Ô này không trống hoặc bị cấm.' };
      }
      r.board[pos.r][pos.c] = { id: `sum_p_${Date.now()}_${Math.random()}`, type: 'p', color, moved: false };
      r.lastMoveSummary = `${cardMeta.name}: Triệu hồi thêm Tốt tại ${'abcdefgh'[pos.c]}${8 - pos.r}!`;
      break;
    }

    case 7: {
      // Đội Hình Chữ V: Di chuyển cùng lúc 2 Tốt tiến lên 1 ô (nếu phía trước trống)
      const { p1, p2 } = targetData;
      const a = r.board[p1?.r]?.[p1?.c];
      const b = r.board[p2?.r]?.[p2?.c];
      if (!a || !b || a.color !== color || b.color !== color || a.type !== 'p' || b.type !== 'p') {
        return { ok: false, error: 'Chọn 2 quân Tốt của bạn.' };
      }
      if (p1.r === p2.r && p1.c === p2.c) return { ok: false, error: 'Phải chọn 2 quân Tốt khác nhau.' };
      const tr1 = p1.r + dir;
      const tr2 = p2.r + dir;
      if (!inBounds(tr1, p1.c) || !inBounds(tr2, p2.c)) return { ok: false, error: 'Tốt không thể tiến thêm.' };
      if (r.board[tr1][p1.c] || r.board[tr2][p2.c] || isVoidSquare(r, tr1, p1.c) || isVoidSquare(r, tr2, p2.c)) {
        return { ok: false, error: 'Ô phía trước của 1 trong 2 Tốt đang bị chặn.' };
      }
      r.board[p1.r][p1.c] = null;
      r.board[p2.r][p2.c] = null;
      r.board[tr1][p1.c] = { ...a, moved: true };
      r.board[tr2][p2.c] = { ...b, moved: true };
      r.lastMoveSummary = `${cardMeta.name}: Đội hình chữ V tiến lên 1 ô!`;
      advanceTurn(room);
      break;
    }

    case 8: {
      // Tốt Đột Kích: 1 Tốt có thể ăn thẳng về phía trước 1 ô trong lượt này
      eff.pawnForwardCaptureTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Tốt của bạn có thể ăn thẳng 1 ô phía trước trong lượt này!`;
      break;
    }

    case 9: {
      // Hoán Đổi Tiền Tuyến: Đổi vị trí 2 quân Tốt bất kỳ của bạn
      const { p1, p2 } = targetData;
      const a = r.board[p1?.r]?.[p1?.c];
      const b = r.board[p2?.r]?.[p2?.c];
      if (!a || !b || a.color !== color || b.color !== color || a.type !== 'p' || b.type !== 'p') {
        return { ok: false, error: 'Chọn 2 quân Tốt của bạn để hoán đổi.' };
      }
      if (p1.r === p2.r && p1.c === p2.c) return { ok: false, error: 'Hãy chọn 2 Tốt khác nhau.' };
      r.board[p1.r][p1.c] = b;
      r.board[p2.r][p2.c] = a;
      r.lastMoveSummary = `${cardMeta.name}: Đã hoán đổi vị trí 2 quân Tốt!`;
      break;
    }

    case 10: {
      // Tốt Nổ Tung: Gắn bùa nổ lên 1 Tốt của bạn
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color || p.type !== 'p') return { ok: false, error: 'Chọn 1 quân Tốt của bạn.' };
      if (!eff.pawnExplosiveIds.includes(p.id)) eff.pawnExplosiveIds.push(p.id);
      r.lastMoveSummary = `${cardMeta.name}: Tốt tại ${'abcdefgh'[pos.c]}${8 - pos.r} đã cài thuốc nổ!`;
      break;
    }

    case 11: {
      // Ngựa Thần Pegasus: Chọn 1 Mã đi 2 nước liên tiếp trong lượt này
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color || p.type !== 'n') return { ok: false, error: 'Chọn 1 quân Mã của bạn.' };
      eff.pegasusCharges = 1;
      r.lastMoveSummary = `${cardMeta.name}: Mã tại ${'abcdefgh'[pos.c]}${8 - pos.r} được đi 2 nước liên tiếp!`;
      break;
    }

    case 12: {
      // Tượng Xuyên Thấu: 1 Tượng nhảy qua tối đa 1 quân cản để ăn địch trong lượt này
      eff.bishopPierceTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Tượng của bạn có thể nhảy qua 1 quân cản để ăn quân địch lượt này!`;
      break;
    }

    case 13: {
      // Xe Tăng Thiết Giáp: 1 Xe húc tiêu diệt quân đầu cản đường và đi tiếp tối đa 2 ô
      eff.rookRamTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Xe của bạn kích hoạt chế độ Xe Tăng Thiết Giáp trong lượt này!`;
      break;
    }

    case 14: {
      // Hậu Bóng Đêm: Hậu tàng hình trong 1 lượt
      eff.queenStealthTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Hậu của ${color === 'w' ? 'Trắng' : 'Đen'} tàng hình trong 1 lượt!`;
      break;
    }

    case 15: {
      // Ám Sát Từ Xa: Chọn 1 Tượng hoặc Mã của bạn, tiêu diệt 1 Tốt địch bất kỳ không cần di chuyển
      const { helperPos, targetPawnPos } = targetData;
      const hp = r.board[helperPos?.r]?.[helperPos?.c];
      const tp = r.board[targetPawnPos?.r]?.[targetPawnPos?.c];
      if (!hp || hp.color !== color || !['b', 'n'].includes(hp.type)) {
        return { ok: false, error: 'Chọn 1 quân Tượng hoặc Mã của bạn làm bệ phóng.' };
      }
      if (!tp || tp.color !== enemy || tp.type !== 'p') {
        return { ok: false, error: 'Chọn 1 quân Tốt của đối thủ để ám sát.' };
      }
      if (isPawnImmortal(r, enemy, tp.id)) return { ok: false, error: 'Tốt địch đang được Bức Tường Thép bảo vệ!' };
      r.capturedBy[color].push(tp);
      r.board[targetPawnPos.r][targetPawnPos.c] = null;
      r.lastMoveSummary = `${cardMeta.name}: Ám sát từ xa hạ gục Tốt địch tại ${'abcdefgh'[targetPawnPos.c]}${8 - targetPawnPos.r}!`;
      break;
    }

    case 16: {
      // Dịch Chuyển Tức Thời: Dịch chuyển 1 Mã đến ô trống trên nửa bàn cờ của bạn
      const { knightPos, destPos } = targetData;
      const kp = r.board[knightPos?.r]?.[knightPos?.c];
      if (!kp || kp.color !== color || kp.type !== 'n') return { ok: false, error: 'Chọn 1 quân Mã của bạn.' };
      const inHalf = color === 'w' ? destPos?.r >= 4 : destPos?.r <= 3;
      if (!inBounds(destPos?.r, destPos?.c) || !inHalf) {
        return { ok: false, error: 'Điểm đến phải nằm trên nửa sân của bạn.' };
      }
      if (r.board[destPos.r][destPos.c] || isVoidSquare(r, destPos.r, destPos.c) || isForbiddenSquare(r, destPos.r, destPos.c)) {
        return { ok: false, error: 'Ô đích không trống.' };
      }
      r.board[knightPos.r][knightPos.c] = null;
      r.board[destPos.r][destPos.c] = { ...kp, moved: true };
      r.lastMoveSummary = `${cardMeta.name}: Mã dịch chuyển tức thời tới ${'abcdefgh'[destPos.c]}${8 - destPos.r}!`;
      break;
    }

    case 17: {
      // Song Sinh Tượng: Nếu mất cả 2 Tượng, hồi sinh 1 Tượng tại ô xuất phát nếu trống
      const aliveBishops = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const p = r.board[row][col];
          if (p && p.color === color && p.type === 'b') aliveBishops.push({ row, col });
        }
      }
      if (aliveBishops.length > 0) {
        return { ok: false, error: 'Bạn vẫn còn Tượng trên bàn cờ (chỉ kích hoạt khi mất cả 2 Tượng).' };
      }
      const homeRow = color === 'w' ? 7 : 0;
      const candidates = [{ row: homeRow, col: 2 }, { row: homeRow, col: 5 }];
      const spot = candidates.find(s => !r.board[s.row][s.col] && !isVoidSquare(r, s.row, s.col));
      if (!spot) return { ok: false, error: 'Cả 2 ô Tượng xuất phát đều đang bị chiếm.' };
      r.board[spot.row][spot.col] = { id: `rev_b_${Date.now()}`, type: 'b', color, moved: false };
      r.lastMoveSummary = `${cardMeta.name}: Hồi sinh Tượng tại ${'abcdefgh'[spot.col]}${8 - spot.row}!`;
      break;
    }

    case 18: {
      // Pháo Đài Di Động: Đổi vị trí giữa 1 Xe và 1 Hậu của bạn
      const { rookPos, queenPos } = targetData;
      const rp = r.board[rookPos?.r]?.[rookPos?.c];
      const qp = r.board[queenPos?.r]?.[queenPos?.c];
      if (!rp || rp.color !== color || rp.type !== 'r') return { ok: false, error: 'Chọn 1 quân Xe của bạn.' };
      if (!qp || qp.color !== color || qp.type !== 'q') return { ok: false, error: 'Chọn quân Hậu của bạn.' };
      r.board[rookPos.r][rookPos.c] = qp;
      r.board[queenPos.r][queenPos.c] = rp;
      r.lastMoveSummary = `${cardMeta.name}: Pháo Đài Di Động đổi chỗ Xe và Hậu!`;
      break;
    }

    case 19: {
      // Cú Đá Hậu Cước: Mã đi như Xe tối đa 3 ô trong lượt này
      eff.knightAsRookTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Mã của bạn có thể di chuyển như Xe (tối đa 3 ô) lượt này!`;
      break;
    }

    case 20: {
      // Giam Cầm: Chọn 1 quân địch (trừ Vua), bị đóng băng không thể đi ở lượt kế tiếp
      const { pos } = targetData;
      const ep = r.board[pos?.r]?.[pos?.c];
      if (!ep || ep.color !== enemy || ep.type === 'k') return { ok: false, error: 'Chọn 1 quân cờ của đối thủ (trừ Vua).' };
      enemyEff.frozenPieceIds.push(ep.id);
      r.lastMoveSummary = `${cardMeta.name}: Đóng băng ${ep.type.toUpperCase()} địch tại ${'abcdefgh'[pos.c]}${8 - pos.r}!`;
      break;
    }

    case 21: {
      // Phản Đòn: Gắn bùa lên 1 quân của bạn
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color) return { ok: false, error: 'Chọn 1 quân cờ của bạn.' };
      if (!eff.counterWardPieceIds.includes(p.id)) eff.counterWardPieceIds.push(p.id);
      r.lastMoveSummary = `${cardMeta.name}: Gắn bùa Phản Đòn lên ${p.type.toUpperCase()} tại ${'abcdefgh'[pos.c]}${8 - pos.r}!`;
      break;
    }

    case 22: {
      // Hồi Sinh Tướng Quân: Hồi sinh 1 Mã hoặc Tượng đã mất vào ô trống ở hàng cuối cùng
      const { pieceType, destPos } = targetData;
      if (!['n', 'b'].includes(pieceType)) return { ok: false, error: 'Chọn loại quân Mã (n) hoặc Tượng (b) để hồi sinh.' };
      const lostIdx = r.capturedBy[enemy].findIndex(p => p.type === pieceType && p.color === color);
      if (lostIdx === -1) return { ok: false, error: `Bạn chưa mất quân ${pieceType === 'n' ? 'Mã' : 'Tượng'} nào.` };
      const backRow = color === 'w' ? 7 : 0;
      if (!inBounds(destPos?.r, destPos?.c) || destPos.r !== backRow) {
        return { ok: false, error: 'Chọn ô trống ở hàng cuối cùng của bạn.' };
      }
      if (r.board[destPos.r][destPos.c] || isVoidSquare(r, destPos.r, destPos.c) || isForbiddenSquare(r, destPos.r, destPos.c)) {
        return { ok: false, error: 'Ô này không trống.' };
      }
      const [revived] = r.capturedBy[enemy].splice(lostIdx, 1);
      r.board[destPos.r][destPos.c] = { ...revived, moved: false };
      r.lastMoveSummary = `${cardMeta.name}: Hồi sinh ${pieceType === 'n' ? 'Mã' : 'Tượng'} tại ${'abcdefgh'[destPos.c]}${8 - destPos.r}!`;
      break;
    }

    case 23: {
      // Vua Thiết Giáp: Vua đi tối đa 2 ô mọi hướng trong lượt này
      eff.kingDoubleStepTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Vua của bạn có thể bước tối đa 2 ô mọi hướng lượt này!`;
      break;
    }

    case 24: {
      // Nhập Thành Bất Quy Tắc: Nhập thành kể cả khi Vua/Xe đã di chuyển
      const { kingPos, rookPos } = targetData;
      const kp = r.board[kingPos?.r]?.[kingPos?.c];
      const rp = r.board[rookPos?.r]?.[rookPos?.c];
      if (!kp || kp.color !== color || kp.type !== 'k') return { ok: false, error: 'Chọn Vua của bạn.' };
      if (!rp || rp.color !== color || rp.type !== 'r' || kingPos.r !== rookPos.r) {
        return { ok: false, error: 'Chọn Xe cùng hàng với Vua.' };
      }
      const minC = Math.min(kingPos.c, rookPos.c);
      const maxC = Math.max(kingPos.c, rookPos.c);
      for (let c = minC + 1; c < maxC; c++) {
        if (r.board[kingPos.r][c] || isVoidSquare(r, kingPos.r, c) || isForbiddenSquare(r, kingPos.r, c)) {
          return { ok: false, error: 'Đường nhập thành đang bị cản.' };
        }
      }
      const stepDir = rookPos.c > kingPos.c ? 1 : -1;
      const newKingC = kingPos.c + stepDir * 2;
      const newRookC = newKingC - stepDir;
      r.board[kingPos.r][kingPos.c] = null;
      r.board[rookPos.r][rookPos.c] = null;
      r.board[kingPos.r][newKingC] = { ...kp, moved: true };
      r.board[rookPos.r][newRookC] = { ...rp, moved: true };
      r.lastMoveSummary = `${cardMeta.name}: Nhập Thành Bất Quy Tắc thành công!`;
      advanceTurn(room);
      break;
    }

    case 25: {
      // Thế Thân Hoàng Gia: Khi Vua đang bị chiếu, đổi chỗ Vua với 1 Tốt của bạn
      if (!isKingInCheck(r, color)) return { ok: false, error: 'Vua của bạn hiện không bị chiếu!' };
      const kingPos = findKing(r.board, color);
      const { pawnPos } = targetData;
      const pp = r.board[pawnPos?.r]?.[pawnPos?.c];
      if (!kingPos || !pp || pp.color !== color || pp.type !== 'p') {
        return { ok: false, error: 'Chọn 1 quân Tốt của bạn để đổi chỗ với Vua.' };
      }
      r.board[kingPos.r][kingPos.c] = pp;
      r.board[pawnPos.r][pawnPos.c] = kingPos.piece;
      r.lastMoveSummary = `${cardMeta.name}: Thế Thân Hoàng Gia đổi chỗ Vua và Tốt!`;
      break;
    }

    case 26: {
      // Vùng Cấm Địa: Chọn 1 ô trống; không quân nào vào ô đó trong 2 lượt tới
      const { pos } = targetData;
      if (!inBounds(pos?.r, pos?.c) || r.board[pos.r][pos.c] || isVoidSquare(r, pos.r, pos.c)) {
        return { ok: false, error: 'Chọn 1 ô trống hợp lệ trên bàn cờ.' };
      }
      r.forbiddenZones.push({ r: pos.r, c: pos.c, turnsLeft: 4, ownerColor: color });
      r.lastMoveSummary = `${cardMeta.name}: Phong tỏa ô ${'abcdefgh'[pos.c]}${8 - pos.r} trong 2 lượt tới!`;
      break;
    }

    case 27: {
      // Uy Quyền Đế Vương: Đẩy lùi mọi quân địch sát cạnh Vua ra xa thêm 1 ô nếu ô sau đó trống
      const kingPos = findKing(r.board, color);
      if (!kingPos) return { ok: false, error: 'Không tìm thấy Vua.' };
      let pushedCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = kingPos.r + dr;
          const nc = kingPos.c + dc;
          if (!inBounds(nr, nc)) continue;
          const ep = r.board[nr][nc];
          if (ep && ep.color === enemy && ep.type !== 'k') {
            const pushR = nr + dr;
            const pushC = nc + dc;
            if (inBounds(pushR, pushC) && !r.board[pushR][pushC] && !isVoidSquare(r, pushR, pushC) && !isForbiddenSquare(r, pushR, pushC)) {
              r.board[pushR][pushC] = ep;
              r.board[nr][nc] = null;
              pushedCount++;
            }
          }
        }
      }
      r.lastMoveSummary = `${cardMeta.name}: Đẩy lùi ${pushedCount} quân địch ra xa khỏi Vua!`;
      break;
    }

    case 28: {
      // Vua Phản Công: Vua ăn quân địch kể cả đang được bảo vệ trong lượt này
      eff.kingCounterAttackTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Vua Phản Công kích hoạt! Vua có thể ăn quân được bảo vệ lượt này.`;
      break;
    }

    case 29: {
      // Lá Chắn Hoàng Kim: Vua miễn nhiễm mọi trạng thái Chiếu trong 1 lượt của đối thủ
      eff.kingCheckImmuneTurns = 2;
      r.lastMoveSummary = `${cardMeta.name}: Vua được bảo vệ bởi Lá Chắn Hoàng Kim!`;
      break;
    }

    case 30: {
      // Triệu Hồi Cận Vệ: Tạo 1 Tốt bảo vệ ở ô trống liền kề Vua của bạn
      const kingPos = findKing(r.board, color);
      const { pos } = targetData;
      if (!kingPos || !inBounds(pos?.r, pos?.c)) return { ok: false, error: 'Chọn ô trống liền kề Vua.' };
      if (Math.abs(pos.r - kingPos.r) > 1 || Math.abs(pos.c - kingPos.c) > 1 || (pos.r === kingPos.r && pos.c === kingPos.c)) {
        return { ok: false, error: 'Ô phải nằm sát cạnh Vua của bạn.' };
      }
      if (r.board[pos.r][pos.c] || isVoidSquare(r, pos.r, pos.c) || isForbiddenSquare(r, pos.r, pos.c)) {
        return { ok: false, error: 'Ô này đang có quân hoặc bị cấm.' };
      }
      r.board[pos.r][pos.c] = { id: `guard_${Date.now()}`, type: 'p', color, moved: false };
      r.lastMoveSummary = `${cardMeta.name}: Triệu hồi Cận Vệ bảo vệ Vua tại ${'abcdefgh'[pos.c]}${8 - pos.r}!`;
      break;
    }

    case 31: {
      // Đảo Ngược Bàn Cờ: Hoán đổi vị trí 2 quân cờ bất kỳ của đối thủ (trừ Vua)
      const { p1, p2 } = targetData;
      const a = r.board[p1?.r]?.[p1?.c];
      const b = r.board[p2?.r]?.[p2?.c];
      if (!a || !b || a.color !== enemy || b.color !== enemy || a.type === 'k' || b.type === 'k') {
        return { ok: false, error: 'Chọn 2 quân cờ của đối thủ (không chọn Vua).' };
      }
      if (p1.r === p2.r && p1.c === p2.c) return { ok: false, error: 'Chọn 2 quân khác nhau.' };
      r.board[p1.r][p1.c] = b;
      r.board[p2.r][p2.c] = a;
      r.lastMoveSummary = `${cardMeta.name}: Hoán đổi vị trí 2 quân của đối thủ!`;
      break;
    }

    case 32: {
      // Lỗ Đen Vũ Trụ: Chọn 1 ô trống, hút 8 quân xung quanh (trừ Vua) vào gần tâm hơn 1 ô nếu có thể
      const { pos } = targetData;
      if (!inBounds(pos?.r, pos?.c) || r.board[pos.r][pos.c] || isVoidSquare(r, pos.r, pos.c)) {
        return { ok: false, error: 'Chọn 1 ô trống làm tâm Lỗ Đen.' };
      }
      let pulled = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const sr = pos.r + dr;
          const sc = pos.c + dc;
          if (!inBounds(sr, sc)) continue;
          const p = r.board[sr][sc];
          if (p && p.type !== 'k') {
            // Ô gần tâm hơn là ô giữa (sr - dr, sc - dc)
            const midR = sr - dr;
            const midC = sc - dc;
            if (inBounds(midR, midC) && !r.board[midR][midC] && !isVoidSquare(r, midR, midC) && !isForbiddenSquare(r, midR, midC)) {
              r.board[midR][midC] = p;
              r.board[sr][sc] = null;
              pulled++;
            }
          }
        }
      }
      r.lastMoveSummary = `${cardMeta.name}: Lỗ Đen hút ${pulled} quân tiến vào tâm!`;
      break;
    }

    case 33: {
      // Cướp Lượt (Time Stop): Sau khi đi xong nước lượt này, đi thêm 1 nước nữa (chỉ Tốt)
      r.pendingTimeStopFor = color;
      r.lastMoveSummary = `${cardMeta.name}: Kích hoạt Cướp Lượt! Sau nước đi này bạn được đi thêm 1 nước Tốt.`;
      break;
    }

    case 34: {
      // Hố Giun Không Gian: Chọn 1 quân ở cột A dịch chuyển sang cột H (và ngược lại)
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color || (pos.c !== 0 && pos.c !== 7)) {
        return { ok: false, error: 'Chọn 1 quân của bạn ở cột A hoặc cột H.' };
      }
      const targetCol = pos.c === 0 ? 7 : 0;
      if (r.board[pos.r][targetCol] || isVoidSquare(r, pos.r, targetCol) || isForbiddenSquare(r, pos.r, targetCol)) {
        return { ok: false, error: 'Ô tương ứng ở cột đối diện đang bị chặn.' };
      }
      r.board[pos.r][pos.c] = null;
      r.board[pos.r][targetCol] = { ...p, moved: true };
      r.lastMoveSummary = `${cardMeta.name}: Dịch chuyển qua Hố Giun tới ${'abcdefgh'[targetCol]}${8 - pos.r}!`;
      break;
    }

    case 35: {
      // Sương Mù Chiến Tranh: Che khuất toàn bộ Tốt của bạn trên màn hình đối thủ trong 1 lượt
      eff.fogOfWarTurns = 2;
      r.lastMoveSummary = `${cardMeta.name}: Sương Mù Chiến Tranh bao phủ đội quân Tốt!`;
      break;
    }

    case 36: {
      // Trọng Lực Nặng: Trong lượt tiếp theo của địch, mọi quân chỉ đi tối đa 2 ô
      enemyEff.heavyGravityTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Trọng Lực Nặng! Đối thủ chỉ đi tối đa 2 ô ở lượt kế tiếp.`;
      break;
    }

    case 37: {
      // Hoán Đổi Linh Hồn: Đổi vị trí 1 quân của bạn với 1 quân cùng loại của đối thủ
      const { myPos, enemyPos } = targetData;
      const mp = r.board[myPos?.r]?.[myPos?.c];
      const ep = r.board[enemyPos?.r]?.[enemyPos?.c];
      if (!mp || mp.color !== color || !ep || ep.color !== enemy) {
        return { ok: false, error: 'Chọn 1 quân của bạn và 1 quân của đối thủ.' };
      }
      if (mp.type !== ep.type || mp.type === 'k') {
        return { ok: false, error: 'Hai quân phải cùng loại và không phải Vua.' };
      }
      r.board[myPos.r][myPos.c] = ep;
      r.board[enemyPos.r][enemyPos.c] = mp;
      r.lastMoveSummary = `${cardMeta.name}: Hoán Đổi Linh Hồn thành công!`;
      break;
    }

    case 38: {
      // Xóa Sổ Ô Cờ: Phá hủy 1 ô trống thành hố sâu vĩnh viễn
      const { pos } = targetData;
      if (!inBounds(pos?.r, pos?.c) || r.board[pos.r][pos.c] || isVoidSquare(r, pos.r, pos.c)) {
        return { ok: false, error: 'Chọn 1 ô trống trên bàn cờ để xóa sổ.' };
      }
      r.voidSquares.push({ r: pos.r, c: pos.c });
      r.lastMoveSummary = `${cardMeta.name}: Ô ${'abcdefgh'[pos.c]}${8 - pos.r} bị xóa sổ vĩnh viễn!`;
      break;
    }

    case 39: {
      // Quay Ngược Thời Gian: Hoàn tác nước đi vừa rồi của đối thủ
      if (!r.lastSnapshot) return { ok: false, error: 'Không có nước đi nào để hoàn tác.' };
      r.board = cloneBoard(r.lastSnapshot.board);
      r.effects = JSON.parse(JSON.stringify(r.lastSnapshot.effects));
      r.voidSquares = JSON.parse(JSON.stringify(r.lastSnapshot.voidSquares));
      r.forbiddenZones = JSON.parse(JSON.stringify(r.lastSnapshot.forbiddenZones));
      r.turn = color;
      r.lastSnapshot = null;
      r.lastMoveSummary = `${cardMeta.name}: Quay ngược thời gian! Đối thủ phải đi lại lượt trước.`;
      break;
    }

    case 40: {
      // Cơn Bão Hỗn Loạn: Ngẫu nhiên hoán đổi 2 quân cờ bất kỳ trên bàn cờ (trừ Vua)
      const nonKings = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const p = r.board[row][col];
          if (p && p.type !== 'k') nonKings.push({ row, col, p });
        }
      }
      if (nonKings.length < 2) return { ok: false, error: 'Không đủ quân cờ để tạo bão hỗn loạn.' };
      const i1 = Math.floor(Math.random() * nonKings.length);
      let i2 = Math.floor(Math.random() * nonKings.length);
      if (i2 === i1) i2 = (i1 + 1) % nonKings.length;
      const a = nonKings[i1];
      const b = nonKings[i2];
      r.board[a.row][a.col] = b.p;
      r.board[b.row][b.col] = a.p;
      r.lastMoveSummary = `${cardMeta.name}: Cơn Bão Hỗn Loạn đảo vị trí 2 quân ngẫu nhiên!`;
      break;
    }

    case 41: {
      // Soi Bài Đối Thủ
      r.revealedEnemyCardsTo = r.revealedEnemyCardsTo || {};
      r.revealedEnemyCardsTo[color] = true;
      r.lastMoveSummary = `${cardMeta.name}: Bạn đã lật ngửa toàn bộ bài trên tay đối thủ!`;
      break;
    }

    case 42: {
      // Đánh Cắp Ý Tưởng: Sao chép ngẫu nhiên 1 lá bài trên tay đối thủ vào tay bạn
      const avail = (r.playerCards[enemy] || []).filter(c => !c.used);
      if (avail.length === 0) return { ok: false, error: 'Đối thủ không còn lá bài chưa dùng nào.' };
      const picked = avail[Math.floor(Math.random() * avail.length)];
      hand.push({
        uid: `stolen_${Date.now()}_${Math.random()}`,
        cardId: picked.cardId,
        used: false
      });
      r.lastMoveSummary = `${cardMeta.name}: Sao chép thành công 1 lá bài từ tay đối thủ!`;
      break;
    }

    case 43: {
      // Phá Hủy Thẻ Bài: Tiêu hủy ngẫu nhiên 1 lá bài chưa dùng trên tay đối thủ
      const avail = (r.playerCards[enemy] || []).filter(c => !c.used);
      if (avail.length === 0) return { ok: false, error: 'Đối thủ không còn lá bài chưa dùng nào.' };
      const picked = avail[Math.floor(Math.random() * avail.length)];
      picked.used = true;
      r.lastMoveSummary = `${cardMeta.name}: Tiêu hủy ngẫu nhiên 1 lá bài trên tay đối thủ!`;
      break;
    }

    case 44: {
      // Khóa Phép (Silence): Đối thủ không được kích hoạt thẻ bài nào trong lượt tiếp theo
      enemyEff.silenceTurns = 1;
      r.lastMoveSummary = `${cardMeta.name}: Khóa Phép! Đối thủ không thể dùng thẻ bài ở lượt kế tiếp.`;
      break;
    }

    case 45: {
      // Hoán Đổi Bộ Bài: Tráo đổi ngẫu nhiên 1 lá bài của bạn lấy 1 lá trên tay đối thủ
      const myUnused = hand.filter(c => !c.used && c.uid !== cardUid);
      const enUnused = (r.playerCards[enemy] || []).filter(c => !c.used);
      if (myUnused.length === 0 || enUnused.length === 0) {
        return { ok: false, error: 'Cần cả hai bên có ít nhất 1 lá bài chưa dùng khác.' };
      }
      const mPick = myUnused[Math.floor(Math.random() * myUnused.length)];
      const ePick = enUnused[Math.floor(Math.random() * enUnused.length)];
      const tempId = mPick.cardId;
      mPick.cardId = ePick.cardId;
      ePick.cardId = tempId;
      r.lastMoveSummary = `${cardMeta.name}: Tráo đổi ngẫu nhiên 1 lá bài với đối thủ!`;
      break;
    }

    case 46: {
      // Tái Chế: Lấy lại 1 lá bài đã dùng trước đó trong ván này để dùng lại
      const usedCards = hand.filter(c => c.used && c.uid !== cardUid);
      if (usedCards.length === 0) return { ok: false, error: 'Bạn chưa dùng lá bài nào khác trong ván này.' };
      const targetUid = targetData.recycleUid || usedCards[0].uid;
      const found = usedCards.find(c => c.uid === targetUid) || usedCards[0];
      found.used = false;
      r.lastMoveSummary = `${cardMeta.name}: Tái chế thành công lá bài đã dùng!`;
      break;
    }

    case 47: {
      // Bẫy Phản Phép: Đặt bẫy; nếu địch dùng thẻ ở lượt tới, hiệu ứng thẻ đó bị vô hiệu hóa
      eff.counterSpellArmed = true;
      r.lastMoveSummary = `${cardMeta.name}: Đã gài Bẫy Phản Phép chờ đối thủ kích hoạt thẻ!`;
      break;
    }

    case 48: {
      // Hiến Tế Lấy Quyền: Tự diệt 1 Mã hoặc Tượng của bạn để hồi phục 2 lá bài đã dùng
      const { pos } = targetData;
      const p = r.board[pos?.r]?.[pos?.c];
      if (!p || p.color !== color || !['n', 'b'].includes(p.type)) {
        return { ok: false, error: 'Chọn 1 quân Mã hoặc Tượng của bạn để hiến tế.' };
      }
      r.capturedBy[enemy].push(p);
      r.board[pos.r][pos.c] = null;
      const usedList = hand.filter(c => c.used && c.uid !== cardUid);
      usedList.slice(0, 2).forEach(c => { c.used = false; });
      r.lastMoveSummary = `${cardMeta.name}: Hiến tế ${p.type.toUpperCase()} để hồi phục thẻ bài!`;
      break;
    }

    case 49: {
      // Cược Tất Tay: Vô hiệu hóa toàn bộ thẻ bài còn lại của cả 2 người trong phần còn lại của ván
      eff.cardsDisabledPermanent = true;
      enemyEff.cardsDisabledPermanent = true;
      r.lastMoveSummary = `${cardMeta.name}: CƯỢC TẤT TAY! Toàn bộ thẻ bài của cả hai bên bị vô hiệu hóa hết ván!`;
      break;
    }

    case 50: {
      // Thẩm Phán Tối Cao: Nếu ít hơn địch từ 3 quân trở lên, diệt 1 quân mạnh nhất của địch (trừ Vua)
      let myCount = 0;
      let enCount = 0;
      let strongestEnemy = null;

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const p = r.board[row][col];
          if (!p) continue;
          if (p.color === color) myCount++;
          else {
            enCount++;
            if (p.type !== 'k') {
              const val = PIECE_VALUE[p.type] || 0;
              if (!strongestEnemy || val > strongestEnemy.val) {
                strongestEnemy = { row, col, p, val };
              }
            }
          }
        }
      }

      if ((enCount - myCount) < 3) {
        return { ok: false, error: 'Bạn cần ít hơn đối thủ từ 3 quân trở lên mới kích hoạt được Thẩm Phán Tối Cao.' };
      }
      if (!strongestEnemy) return { ok: false, error: 'Không có quân địch hợp lệ để tiêu diệt.' };
      r.capturedBy[color].push(strongestEnemy.p);
      r.board[strongestEnemy.row][strongestEnemy.col] = null;
      r.lastMoveSummary = `${cardMeta.name}: Thẩm Phán Tối Cao giáng đòn tiêu diệt ${strongestEnemy.p.type.toUpperCase()} mạnh nhất của địch!`;
      break;
    }

    default:
      return { ok: false, error: 'Lá bài không tồn tại.' };
  }

  cardSlot.used = true;
  r.cardPlayedThisTurn = true;
  checkRoundEnd(room);
  return { ok: true };
}

io.on('connection', (socket) => {
  socket.on('create_room', ({ playerName, deck }) => {
    const code = generateRoomCode();
    const validDeck = Array.isArray(deck) && deck.length === 5 ? deck : [1, 11, 23, 33, 41];
    const room = createRoom(code, socket, playerName, validDeck);
    rooms.set(code, room);
    socket.join(code);
    socket.emit('room_created', { code });
    broadcastRoomState(room);
  });

  socket.on('join_room', ({ code, playerName, deck }) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const room = rooms.get(cleanCode);
    if (!room) {
      socket.emit('error_msg', 'Không tìm thấy mã phòng này!');
      return;
    }
    if (room.players.length >= 2 && room.players[1].connected) {
      socket.emit('error_msg', 'Phòng đã đủ 2 người chơi!');
      return;
    }

    const validDeck = Array.isArray(deck) && deck.length === 5 ? deck : [2, 12, 24, 34, 42];
    if (room.players.length === 1) {
      room.players.push({
        socketId: socket.id,
        name: playerName || 'Người Chơi 2',
        deck: validDeck,
        connected: true
      });
      room.round = createRoundState(room);
    } else {
      room.players[1].socketId = socket.id;
      room.players[1].name = playerName || room.players[1].name;
      room.players[1].deck = validDeck;
      room.players[1].connected = true;
      if (!room.round) room.round = createRoundState(room);
    }

    socket.join(cleanCode);
    socket.emit('room_joined', { code: cleanCode });
    broadcastRoomState(room);
  });

  socket.on('update_deck', ({ code, deck }) => {
    const room = rooms.get(code);
    if (!room) return;
    const slot = getPlayerSlot(room, socket.id);
    if (slot === -1 || !Array.isArray(deck) || deck.length !== 5) return;
    room.players[slot].deck = deck;
  });

  socket.on('make_move', ({ code, from, to, promotionChoice }) => {
    const room = rooms.get(code);
    if (!room || !room.round || room.matchWinner || room.round.winnerColor) return;
    const color = getPlayerColor(room, socket.id);
    if (!color || room.round.turn !== color) {
      socket.emit('error_msg', 'Chưa tới lượt của bạn!');
      return;
    }
    if (!isLegalNormalMove(room.round, color, from.r, from.c, to.r, to.c, true)) {
      socket.emit('error_msg', 'Nước đi không hợp lệ theo luật hiện tại!');
      return;
    }
    const res = executeNormalMove(room, color, { from, to, promotionChoice });
    if (!res.ok) {
      socket.emit('error_msg', res.error);
      return;
    }
    broadcastRoomState(room);
  });

  socket.on('play_card', ({ code, cardUid, targetData }) => {
    const room = rooms.get(code);
    if (!room || !room.round || room.matchWinner || room.round.winnerColor) return;
    const color = getPlayerColor(room, socket.id);
    if (!color) return;

    const res = applyCardEffect(room, color, cardUid, targetData || {});
    if (!res.ok) {
      socket.emit('error_msg', res.error);
      return;
    }
    broadcastRoomState(room);
  });

  socket.on('next_round', ({ code }) => {
    const room = rooms.get(code);
    if (!room || !room.round || !room.round.winnerColor || room.matchWinner) return;
    room.roundNumber++;
    room.round = createRoundState(room);
    broadcastRoomState(room);
  });

  socket.on('rematch_bo3', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;
    room.roundNumber = 1;
    room.scores = { p1: 0, p2: 0 };
    room.matchWinner = null;
    room.round = createRoundState(room);
    broadcastRoomState(room);
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, code) => {
      const slot = getPlayerSlot(room, socket.id);
      if (slot !== -1) {
        room.players[slot].connected = false;
        io.to(code).emit('opponent_disconnected', {
          message: `${room.players[slot].name} đã ngắt kết nối.`
        });
        broadcastRoomState(room);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`ILLEGAL CHESS server running on port ${PORT}`);
});

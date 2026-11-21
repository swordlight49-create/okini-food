const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Dữ liệu khởi tạo mặc định (Phòng trường hợp Render khởi động lại server)
const defaultData = {
    users: [
        { username: 'Nhan Vien', password: 'okini202699', role: 'admin', points: 99999, online: false }
    ],
    products: [
        {
            id: 'wagyu-a5',
            name: 'Bò Wagyu Nhật Bản A5 Miyazaki (Thăn Ngoại)',
            origin: 'Miyazaki, Nhật Bản',
            bms: 'BMS 11-12',
            basePrice250g: 1450000,
            soldCount: 48,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
            desc: 'Vân mỡ cẩm thạch tan chảy ngay đầu lưỡi, đạt chuẩn A5 cao nhất hiệp hội thịt bò Nhật Bản.'
        },
        {
            id: 'black-angus-tenderloin',
            name: 'Thăn Nội Bò Mỹ Black Angus Prime',
            origin: 'Nebraska, Hoa Kỳ',
            bms: 'BMS 8-9',
            basePrice250g: 520000,
            soldCount: 65,
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
            desc: 'Phần thịt mềm mại nhất của con bò, ít mỡ, ngọt thanh, lý tưởng cho món Beefsteak hảo hạng.'
        },
        {
            id: 'short-rib-boneless',
            name: 'Sườn Non Bò Mỹ Rút Xương (Short Rib)',
            origin: 'Texas, Hoa Kỳ',
            bms: 'BMS 9',
            basePrice250g: 430000,
            soldCount: 54,
            image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
            desc: 'Đan xen hoàn hảo giữa thớ thịt đỏ au và lớp mỡ thơm ngậy, cực phẩm cho tiệc nướng BBQ.'
        },
        {
            id: 'au-top-blade',
            name: 'Lõi Vai Bò Úc Ngũ Cốc (Top Blade)',
            origin: 'Victoria, Úc',
            bms: 'BMS 6-7',
            basePrice250g: 245000,
            soldCount: 82,
            image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80',
            desc: 'Có đường gân giòn sần sật ở giữa đặc trưng, thịt mềm mọng nước, giá thành hợp lý.'
        },
        {
            id: 'short-plate-roll',
            name: 'Ba Chỉ Bò Mỹ Cuộn Lẩu / Nướng',
            origin: 'Kansas, Hoa Kỳ',
            bms: 'BMS 6',
            basePrice250g: 165000,
            soldCount: 112,
            image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
            desc: 'Thái lát mỏng tiêu chuẩn 1.5mm, béo ngậy không ngán, chuyên dụng cho lẩu Shabu và nướng.'
        },
        {
            id: 'ribeye-wagyu-au',
            name: 'Đầu Thăn Ngoại Bò Wagyu Úc (Ribeye)',
            origin: 'Queensland, Úc',
            bms: 'BMS 8-9',
            basePrice250g: 680000,
            soldCount: 39,
            image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
            desc: 'Mắt mỡ đặc trưng tạo độ béo thơm bùng nổ khi áp chảo với bơ và lá hương thảo.'
        }
    ],
    orders: [],
    aiRules: [
        { id: 'r1', keyword: 'xin chào|chào|hello|hi', reply: 'Xin chào quý khách! Em là trợ lý AI của OKINI FOOD. Hôm nay anh/chị muốn tìm thịt bò làm Steak, nướng BBQ hay nhúng lẩu ạ?' },
        { id: 'r2', keyword: 'giảm giá|voucher|khuyến mãi|mã', reply: 'OKINI FOOD đang có mã giảm giá 10%: OKINI10 và mã giảm 100k cho đơn từ 1 triệu: WAGYU100. Anh/chị nhập ở bước thanh toán nhé!' },
        { id: 'r3', keyword: 'steak|áp chảo|bít tết', reply: 'Để làm Steak ngon nhất, anh/chị nên chọn Thăn Nội Bò Mỹ Prime (mềm tan) hoặc Ribeye Wagyu Úc (béo ngậy). Đừng quên dùng đồng hồ bấm giờ ở tab "Góc Bếp" để canh độ chín chuẩn nhà hàng nhé!' },
        { id: 'r4', keyword: 'lẩu|nướng|bbq', reply: 'Cho tiệc lẩu và nướng BBQ, Ba Chỉ Bò Mỹ Cuộn và Sườn Non Rút Xương là lựa chọn số 1 ạ. Anh/chị có thể vào mục "Combo Tiệc Tại Gia" để hệ thống tính lượng thịt theo số người ăn nhé!' },
        { id: 'r5', keyword: 'giao hàng|ship|bao lâu', reply: 'OKINI FOOD giao hỏa tốc trong 60 phút nội thành bằng thùng giữ nhiệt chuyên dụng -18°C, đảm bảo thịt tươi nguyên vẹn ạ!' }
    ],
    chatMessages: [
        { id: 'm0', sender: 'AI Okini', role: 'bot', targetUser: 'ALL', text: 'Chào mừng bạn đến với OKINI FOOD! Nhắn tin tại đây để được tư vấn chọn thịt bò chuẩn vị nhé.', time: 'Hệ thống' }
    ],
    reviews: [
        { id: 'rev1', user: 'Minh Khang', rating: 5, product: 'Bò Wagyu Nhật Bản A5', comment: 'Thịt vân mỡ đẹp xuất sắc, áp chảo xong mềm tan trong miệng. Đóng gói thùng giữ nhiệt cực kỳ chuyên nghiệp!', date: '20/11/2026' },
        { id: 'rev2', user: 'Thảo Vy', rating: 5, product: 'Ba Chỉ Bò Mỹ Cuộn', comment: 'Giao hàng siêu nhanh, thịt không bị ra nước. Cả nhà ăn lẩu cuối tuần khen nức nở.', date: '19/11/2026' },
        { id: 'rev3', user: 'Hoàng Nam', rating: 4, product: 'Lõi Vai Bò Úc', comment: 'Gân giòn sần sật rất ngon, dùng tính năng đồng hồ bấm giờ trên web làm Steak Medium Rare chuẩn không cần chỉnh.', date: '18/11/2026' }
    ],
    batches: {
        'LOT-JP889': { product: 'Bò Wagyu Nhật Bản A5 Miyazaki', farm: 'Trang trại Takachiho, Miyazaki, Japan', importDate: '15/11/2026', temp: '-18.5°C Liên tục', cert: 'JAS Organic & Kiểm dịch Thú y Cấp I' },
        'LOT-US402': { product: 'Thăn Nội Bò Mỹ Black Angus Prime', farm: 'Greater Omaha Packing, Nebraska, USA', importDate: '17/11/2026', temp: '-18.0°C Liên tục', cert: 'USDA Prime Standard & HACCP' },
        'LOT-AU105': { product: 'Lõi Vai Bò Úc Ngũ Cốc', farm: 'Teys Australia, Victoria, Australia', importDate: '18/11/2026', temp: '-18.2°C Liên tục', cert: 'AUS-MEAT MSA Grade & ISO 22000' }
    }
};

// Nạp dữ liệu từ file JSON hoặc dùng dữ liệu mặc định
let db = JSON.parse(JSON.stringify(defaultData));
if (fs.existsSync(DB_FILE)) {
    try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        db = JSON.parse(raw);
        // Reset trạng thái online khi server restart
        db.users.forEach(u => u.online = false);
    } catch (e) {
        console.error('Lỗi đọc database.json, dùng dữ liệu mặc định:', e);
    }
}

function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch (e) {
        console.error('Lỗi ghi database.json:', e);
    }
}

// Hàm sinh câu trả lời tự động từ AI theo kịch bản Admin
function generateAIReply(userText) {
    const lower = userText.toLowerCase();
    for (const rule of db.aiRules) {
        const keywords = rule.keyword.split('|').map(k => k.trim().toLowerCase()).filter(Boolean);
        if (keywords.some(k => lower.includes(k))) {
            return rule.reply;
        }
    }
    return 'Cảm ơn quý khách đã nhắn tin cho OKINI FOOD! Hiện nhân viên tư vấn đang xem tin nhắn của anh/chị. Trong lúc chờ, anh/chị có thể tham khảo các dòng Bò Wagyu A5, Thăn nội Mỹ Prime hoặc dùng mục "Combo Tiệc Tại Gia" nhé!';
}

const activeSockets = new Map(); // socket.id -> username

io.on('connection', (socket) => {
    // Gửi dữ liệu khởi tạo ban đầu cho client
    socket.emit('init_data', {
        products: db.products,
        reviews: db.reviews,
        batches: db.batches,
        aiRules: db.aiRules
    });

    // Đăng nhập / Đăng ký
    socket.on('auth_action', ({ mode, username, password }, callback) => {
        const cleanUser = (username || '').trim();
        const cleanPass = (password || '').trim();

        if (!cleanUser || !cleanPass) {
            return callback({ success: false, message: 'Vui lòng nhập đầy đủ tên và mật khẩu!' });
        }

        let user = db.users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());

        if (mode === 'register') {
            if (user) {
                return callback({ success: false, message: 'Tên tài khoản này đã tồn tại, vui lòng chọn tên khác hoặc đăng nhập!' });
            }
            user = {
                username: cleanUser,
                password: cleanPass,
                role: 'customer',
                points: 100, // Tặng 100 điểm chào mừng
                online: true
            };
            db.users.push(user);
            saveDB();
        } else {
            if (!user || user.password !== cleanPass) {
                return callback({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
            }
            user.online = true;
        }

        activeSockets.set(socket.id, user.username);
        io.emit('admin_sync_users', db.users);

        // Lọc lịch sử chat và đơn hàng phù hợp quyền hạn
        const userOrders = user.role === 'admin' ? db.orders : db.orders.filter(o => o.customer === user.username);
        const userChats = user.role === 'admin'
            ? db.chatMessages
            : db.chatMessages.filter(m => m.targetUser === 'ALL' || m.targetUser === user.username || m.sender === user.username);

        callback({
            success: true,
            user: { username: user.username, role: user.role, points: user.points },
            orders: userOrders,
            chats: userChats,
            allUsers: user.role === 'admin' ? db.users : []
        });
    });

    // Đặt hàng thử nghiệm
    socket.on('place_order', (orderData, callback) => {
        const orderId = '#OKINI-' + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            id: orderId,
            customer: orderData.customer,
            items: orderData.items,
            total: orderData.total,
            address: orderData.address,
            note: orderData.note || '',
            statusStep: 1, // 1 đến 5
            createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN')
        };

        db.orders.unshift(newOrder);

        // Cộng điểm tích lũy & cập nhật số lượng bán (Best-Seller)
        const user = db.users.find(u => u.username === orderData.customer);
        let earnedPoints = Math.floor(orderData.total / 10000);
        if (user) {
            user.points += earnedPoints;
        }

        orderData.items.forEach(item => {
            const prod = db.products.find(p => p.id === item.productId);
            if (prod) prod.soldCount += item.qty;
        });

        saveDB();

        // Đồng bộ real-time cho tất cả
        io.emit('order_created', newOrder);
        io.emit('update_products', db.products);
        io.emit('admin_sync_users', db.users);

        callback({ success: true, order: newOrder, newPoints: user ? user.points : 0 });
    });

    // Cập nhật trạng thái đơn hàng (Từ Admin hoặc nút Giả lập tua nhanh của khách)
    socket.on('update_order_status', ({ orderId, nextStep }) => {
        const order = db.orders.find(o => o.id === orderId);
        if (order) {
            order.statusStep = Math.min(5, Math.max(1, nextStep));
            saveDB();
            io.emit('order_status_updated', order);
        }
    });

    // Đổi điểm thưởng
    socket.on('redeem_points', ({ username, cost, rewardName }, callback) => {
        const user = db.users.find(u => u.username === username);
        if (!user || user.points < cost) {
            return callback({ success: false, message: 'Bạn chưa đủ điểm để đổi phần quà này!' });
        }
        user.points -= cost;
        saveDB();
        io.emit('admin_sync_users', db.users);
        callback({ success: true, newPoints: user.points, message: `Đổi thành công: ${rewardName}!` });
    });

    // Chat Real-time (Khách gửi -> AI trả lời tự động; hoặc Admin can thiệp trực tiếp)
    socket.on('send_chat', ({ sender, role, targetUser, text }) => {
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const msg = {
            id: 'msg-' + Date.now(),
            sender,
            role, // 'customer' | 'admin' | 'bot'
            targetUser: role === 'admin' ? targetUser : sender,
            text,
            time: timeStr
        };
        db.chatMessages.push(msg);
        io.emit('receive_chat', msg);

        // Nếu là khách hàng nhắn, AI tự động phản hồi sau 600ms
        if (role === 'customer') {
            setTimeout(() => {
                const aiReplyText = generateAIReply(text);
                const botMsg = {
                    id: 'bot-' + Date.now(),
                    sender: 'Nhân viên AI Okini',
                    role: 'bot',
                    targetUser: sender,
                    text: aiReplyText,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                };
                db.chatMessages.push(botMsg);
                saveDB();
                io.emit('receive_chat', botMsg);
            }, 600);
        } else {
            saveDB();
        }
    });

    // Admin cập nhật kịch bản AI (Thêm/Sửa/Xóa)
    socket.on('admin_save_ai_rules', (newRules) => {
        db.aiRules = newRules;
        saveDB();
        io.emit('ai_rules_updated', db.aiRules);
    });

    // Khách gửi đánh giá sản phẩm mới
    socket.on('add_review', (reviewData) => {
        const newRev = {
            id: 'rev-' + Date.now(),
            user: reviewData.user,
            rating: Number(reviewData.rating),
            product: reviewData.product,
            comment: reviewData.comment,
            date: new Date().toLocaleDateString('vi-VN')
        };
        db.reviews.unshift(newRev);
        saveDB();
        io.emit('reviews_updated', db.reviews);
    });

    // Ngắt kết nối
    socket.on('disconnect', () => {
        const username = activeSockets.get(socket.id);
        if (username) {
            activeSockets.delete(socket.id);
            const stillConnected = Array.from(activeSockets.values()).includes(username);
            if (!stillConnected) {
                const user = db.users.find(u => u.username === username);
                if (user) user.online = false;
                io.emit('admin_sync_users', db.users);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🔥 OKINI FOOD SERVER ĐANG CHẠY TẠI CỔNG ${PORT}`);
    console.log(`👉 Truy cập: http://localhost:${PORT}`);
    console.log(`🔑 Tài khoản Admin: Nhan Vien | Mật khẩu: okini202699`);
    console.log(`==================================================`);
});
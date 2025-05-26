import {
    Start,
    Update,
    Command,
    InjectBot,
    Ctx,
    On,
} from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { OrderService } from 'src/order/order.service';
import { Context, Telegraf, Markup } from 'telegraf';
import { Roles } from '@prisma/client';
import { Request } from 'express';

interface OrderProduct {
    productId: number;
    levelId: number;
    quantity: number;
}

interface OrderTool {
    toolId: number;
    quantity: number;
}

interface SessionData {
    step?: string;
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: number;
    createdAt?: number;
    orderData?: {
        location?: { lat: string; long: string };
        address?: string;
        paymentType?: string;
        withDelivery?: boolean;
        commentToDelivery?: string;
        date?: string;
        orderProducts?: OrderProduct;
        orderTools?: OrderTool[];
        currentTool?: number;
    };
}

@Update()
export class TgMessage {
    private sessions = new Map<number, SessionData>();
    private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

    constructor(
        private prisma: PrismaService,
        @InjectBot() private bot: Telegraf<Context>,
        private userService: UserService,
        private orderService: OrderService
    ) {}

    async onModuleInit() {
        await this.bot.telegram.setMyCommands([
            { command: 'start', description: 'Start the bot' },
            { command: 'register', description: 'Register to the bot' },
            { command: 'verify', description: 'Verify your email with OTP' },
            { command: 'login', description: 'Login to the bot' },
            { command: 'logout', description: 'Logout from the bot' },
            { command: 'order', description: 'Create order' },
            { command: 'my_orders', description: 'See my order history' },
            { command: 'cancel', description: 'Cancel current action' },
        ]);
        this.cleanupSessions();
    }

    private cleanupSessions() {
        setInterval(() => {
            const now = Date.now();
            for (const [userId, session] of this.sessions) {
                if (session.createdAt && now - session.createdAt > this.SESSION_TIMEOUT) {
                    this.sessions.delete(userId);
                }
            }
        }, 60 * 60 * 1000); // Run every hour
    }

    private async checkSessionTimeout(ctx: Context, next: () => Promise<void>) {
        const userId = ctx.from?.id;
        if (!userId) {
            await ctx.reply('Foydalanuvchi ID topilmadi.');
            return;
        }
        const session = this.sessions.get(userId);
        if (session?.createdAt && Date.now() - session.createdAt > this.SESSION_TIMEOUT && session.step !== 'login_password') {
            this.sessions.delete(userId);
            await ctx.reply('Sessiya muddati tugadi. Iltimos, qayta /register yoki /login qiling.');
            return;
        }
        await next();
    }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply(`Hush kelibsiz ${ctx.from?.first_name} 🤗!`);
        await ctx.replyWithAnimation("CgACAgQAAxkBAAIBS2gy-Sns6A5Xp4xLaxDSr9-6VBQvAALsAgACWboMU3lGbMid6Cd4NgQ");
    }

    @Command('register')
    async onRegister(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi. Iltimos, qaytadan urinib ko‘ring.');
                return;
            }

            const session = this.sessions.get(userId);
            if (session?.step) {
                await ctx.reply('Sizda allaqachon jarayon davom etmoqda. /cancel bilan bekor qiling yoki davom eting.');
                return;
            }

            this.sessions.set(userId, { step: 'name', createdAt: Date.now() });
            await ctx.reply('Ismingizni kiriting:', {
                reply_markup: { remove_keyboard: true }
            });
        });
    }

    @Command('verify')
    async onVerifyCommand(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi.');
                return;
            }

            const session = this.sessions.get(userId);
            if (session?.accessToken) {
                await ctx.reply('Siz allaqachon tizimga kirgansiz. /logout bilan chiqing yoki davom eting.');
                return;
            }

            this.sessions.set(userId, { ...session, step: 'verify', createdAt: Date.now() });
            await ctx.reply('Iltimos, emailingizga yuborilgan 5 xonali kodni kiriting:');
        });
    }

    @Command('login')
    async onLogin(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi.');
                return;
            }

            const session = this.sessions.get(userId);
            if (session?.accessToken) {
                await ctx.reply('Siz allaqachon tizimga kirgansiz. /logout bilan chiqing yoki /order bilan buyurtma bering.');
                return;
            }

            if (session?.step) {
                await ctx.reply('Sizda allaqachon jarayon davom etmoqda. /cancel bilan bekor qiling yoki davom eting.');
                return;
            }

            this.sessions.set(userId, { step: 'login_email', createdAt: Date.now() });
            await ctx.reply('Iltimos, emailingizni kiriting:');
        });
    }

    @Command('logout')
    async onLogout(@Ctx() ctx: Context) {
        const userId = ctx.from?.id;
        if (!userId) {
            await ctx.reply('Foydalanuvchi ID topilmadi.');
            return;
        }

        const session = this.sessions.get(userId);
        if (!session?.accessToken) {
            await ctx.reply('Siz tizimga kirmagansiz. /login bilan kiring.');
            return;
        }

        this.sessions.delete(userId);
        await ctx.reply('Siz tizimdan muvaffaqiyatli chiqdingiz.', {
            reply_markup: { remove_keyboard: true },
        });
    }

    @Command('cancel')
    async onCancel(@Ctx() ctx: Context) {
        const userId = ctx.from?.id;
        if (!userId) {
            await ctx.reply('Foydalanuvchi ID topilmadi.');
            return;
        }

        const session = this.sessions.get(userId);
        if (session?.accessToken) {
            this.sessions.set(userId, {
                accessToken: session.accessToken,
                refreshToken: session.refreshToken,
                userId: session.userId,
                createdAt: session.createdAt,
            });
        } else {
            this.sessions.delete(userId);
        }

        await ctx.reply('Amal bekor qilindi. Yangi jarayon boshlash uchun buyruq kiriting.', {
            reply_markup: { remove_keyboard: true },
        });
    }

    @Command('order')
    async onOrder(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi.');
                return;
            }

            const session = this.sessions.get(userId);
            if (!session?.accessToken || !session?.userId) {
                await ctx.reply('Iltimos, avval tizimga kiring /login buyrugʻi orqali.');
                return;
            }

            if (session?.step?.startsWith('order_')) {
                await ctx.reply('Sizda allaqachon buyurtma jarayoni davom etmoqda. Yakunlang yoki /cancel bilan bekor qiling.');
                return;
            }

            this.sessions.set(userId, {
                ...session,
                step: 'order_location',
                orderData: {},
                createdAt: session.createdAt || Date.now(),
            });

            await ctx.reply('Iltimos, joylashuvingizni yuboring:', {
                reply_markup: {
                    keyboard: [[{ text: '📍 Joylashuvni yuborish', request_location: true }]],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        });
    }

    @On('location')
    async onLocation(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi.');
                return;
            }

            const session = this.sessions.get(userId);
            if (!session || session.step !== 'order_location') {
                await ctx.reply('Iltimos, /order buyrug‘ini qayta bajaring.');
                return;
            }

            if (!('location' in ctx.message!)) return;
            const location = ctx.message.location;

            session.orderData = {
                ...session.orderData,
                location: {
                    lat: location.latitude.toString(),
                    long: location.longitude.toString()
                }
            };
            session.step = 'order_address';
            this.sessions.set(userId, session);

            await ctx.reply('Iltimos, manzilingizni matn koʻrinishida kiriting:', {
                reply_markup: { remove_keyboard: true }
            });
        });
    }

    @On('text')
    async onText(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            try {
                const userId = ctx.from?.id;
                if (!userId) {
                    await ctx.reply('Foydalanuvchi ID topilmadi.');
                    return;
                }

                const session = this.sessions.get(userId);
                if (!session) {
                    await ctx.reply('Iltimos, avval /register yoki /login buyrug‘ini ishlatib ro‘yxatdan o‘ting.');
                    return;
                }

                if (!('text' in ctx.message!)) return;
                const text = ctx.message.text;

                if (session.step?.startsWith('order_')) {
                    await this.handleOrderSteps(ctx, session, userId, text);
                    return;
                }

                switch (session.step) {
                    case 'name':
                        if (!text.trim()) {
                            await ctx.reply('Ismingizni kiriting (bo‘sh bo‘lmasligi kerak):');
                            return;
                        }
                        session.name = text.trim();
                        session.step = 'phone';
                        this.sessions.set(userId, session);
                        await ctx.reply('Iltimos, telefon raqamingizni yuboring:', {
                            reply_markup: {
                                keyboard: [[{ text: '📱 Telefon raqamni yuborish', request_contact: true }]],
                                resize_keyboard: true,
                                one_time_keyboard: true
                            }
                        });
                        break;

                    case 'phone':
                        await ctx.reply('Iltimos, telefon raqamingizni ulashish uchun "📱 Telefon raqamni yuborish" tugmasini bosing.', {
                            reply_markup: {
                                keyboard: [[{ text: '📱 Telefon raqamni yuborish', request_contact: true }]],
                                resize_keyboard: true,
                                one_time_keyboard: true
                            }
                        });
                        break;

                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(text)) {
                            await ctx.reply('Iltimos, to‘g‘ri email manzilini kiriting (masalan: example@domain.com):');
                            return;
                        }
                        const existsEmail = await this.prisma.user.findFirst({ where: { email: text } });
                        if (existsEmail) {
                            await ctx.reply('Bu email allaqachon ro‘yxatdan o‘tgan. Iltimos, boshqa email kiriting:');
                            return;
                        }
                        session.email = text;
                        session.step = 'password';
                        this.sessions.set(userId, session);
                        await ctx.reply('Parolingizni kiriting:', {
                            reply_markup: { remove_keyboard: true }
                        });
                        break;

                    case 'password':
                        if (text.length < 6) {
                            await ctx.reply('Parol kamida 6 belgi bo‘lishi kerak. Iltimos, qaytadan kiriting:');
                            return;
                        }
                        session.password = text;
                        session.step = 'region';
                        this.sessions.set(userId, session);

                        const regions = await this.prisma.region.findMany({ select: { id: true, name: true } });
                        if (!regions.length) {
                            await ctx.reply('Hozirda hududlar mavjud emas. Iltimos, keyinroq urinib ko‘ring.');
                            this.sessions.delete(userId);
                            return;
                        }

                        const buttons = regions.map((r) => [Markup.button.text(r.name || `Region ${r.id}`)]);
                        await ctx.reply('Hududingizni tanlang:', {
                            reply_markup: {
                                keyboard: buttons,
                                resize_keyboard: true,
                                one_time_keyboard: true
                            }
                        });
                        break;

                    case 'region':
                        const region = await this.prisma.region.findFirst({
                            where: { name: text }
                        });

                        if (!region) {
                            await ctx.reply('Noto‘g‘ri region. Iltimos, klaviaturadan tanlang:');
                            const regions = await this.prisma.region.findMany({ select: { id: true, name: true } });
                            const buttons = regions.map((r) => [Markup.button.text(r.name || `Region ${r.id}`)]);
                            await ctx.reply('Hududingizni tanlang:', {
                                reply_markup: {
                                    keyboard: buttons,
                                    resize_keyboard: true,
                                    one_time_keyboard: true
                                }
                            });
                            return;
                        }

                        const { name, phone, email, password } = session;
                        if (!name || !phone || !email || !password) {
                            await ctx.reply('Ma\'lumotlar to\'liq emas. Iltimos, /register buyrug\'ini qayta kiriting.');
                            this.sessions.delete(userId);
                            return;
                        }

                        const data = {
                            name,
                            phone,
                            email,
                            password,
                            role: Roles.USER,
                            regionId: region.id,
                            telegramId: userId.toString()
                        };

                        try {
                            const user = await this.userService.register(data);
                            session.step = 'verify';
                            session.userId = user.id;
                            this.sessions.set(userId, session);
                            await ctx.reply('Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz ✅', {
                                reply_markup: { remove_keyboard: true }
                            });
                            await ctx.reply('Iltimos, emailingizga yuborilgan 5 xonali kodni kiriting: 🔐');
                        } catch (error) {
                            console.error(`Registration error for user ${userId}:`, error);
                            await ctx.reply('Ro‘yxatdan o‘tishda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
                            this.sessions.delete(userId);
                        }
                        break;

                    case 'verify':
                        const emailForVerify = session.email;
                        if (!emailForVerify) {
                            await ctx.reply('Email topilmadi. Iltimos, /register buyrug‘ini qayta bajaring.');
                            this.sessions.delete(userId);
                            return;
                        }
                        try {
                            await this.userService.verifyEmail({ email: emailForVerify, otp: text });
                            await ctx.reply('Siz muvaffaqiyatli tasdiqlandingiz! Endi /login buyrug‘i bilan tizimga kirishingiz mumkin.');
                            this.sessions.delete(userId);
                        } catch (error) {
                            console.error(`Verification error for user ${userId}:`, error);
                            await ctx.reply('Kod noto‘g‘ri yoki muddati o‘tgan. Iltimos, qaytadan urinib ko‘ring.');
                        }
                        break;

                    case 'login_email':
                        session.email = text;
                        session.step = 'login_password';
                        this.sessions.set(userId, session);
                        await ctx.reply('Parolingizni kiriting:');
                        break;

                    case 'login_password':
                        session.password = text;

                        if (!session.email || !session.password) {
                            await ctx.reply('Email yoki parol kiritilmadi. Iltimos, /login buyrug‘ini qayta bajarib urinib ko‘ring.');
                            this.sessions.delete(userId);
                            return;
                        }

                        try {
                            const fakeReq = {
                                headers: {
                                    'user-agent': ctx.from?.username || 'TelegramBot'
                                }
                            } as unknown as Request;

                            const tokens = await this.userService.login(
                                { email: session.email, password: session.password },
                                fakeReq
                            );

                            const user = await this.prisma.user.findUnique({ where: { email: session.email } });
                            if (!user) throw new Error('User not found');

                            await ctx.reply('Siz tizimga muvaffaqiyatli kirdingiz!');
                            this.sessions.set(userId, {
                                accessToken: tokens.access,
                                refreshToken: tokens.refresh,
                                userId: user.id,
                                createdAt: Date.now(),
                            });
                        } catch (error) {
                            console.error(`Login error for user ${userId}:`, error);
                            await ctx.reply('Email yoki parol noto‘g‘ri. Iltimos, qaytadan urinib ko‘ring.');
                            this.sessions.delete(userId);
                        }
                        break;

                    default:
                        await ctx.reply('Noma\'lum holat. Iltimos, /register yoki /login buyrug‘ini qayta kiriting.');
                        this.sessions.delete(userId);
                        break;
                }
            } catch (error) {
                console.error(`Text handler error for user ${ctx.from?.id}:`, error);
                await ctx.reply('Ichki xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
                // this.sessions.delete(userId);
            }
        });
    }

    @On('contact')
    async onContact(@Ctx() ctx: Context) {
        await this.checkSessionTimeout(ctx, async () => {
            const userId = ctx.from?.id;
            if (!userId) {
                await ctx.reply('Foydalanuvchi ID topilmadi.');
                return;
            }

            const session = this.sessions.get(userId);
            if (!session || session.step !== 'phone') {
                await ctx.reply('Iltimos, avval /register buyrug‘ini ishlatib ro‘yxatdan o‘ting.');
                return;
            }

            if (!('contact' in ctx.message!)) return;
            const phone = ctx.message.contact.phone_number;

            const existsPhone = await this.prisma.user.findFirst({ where: { phone } });
            if (existsPhone) {
                await ctx.reply('Bu telefon raqam allaqachon ro‘yxatdan o‘tgan. Iltimos, boshqa raqam yuboring.', {
                    reply_markup: {
                        keyboard: [[{ text: '📱 Telefon raqamni yuborish', request_contact: true }]],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                return;
            }

            session.phone = phone;
            session.step = 'email';
            this.sessions.set(userId, session);

            await ctx.reply('Email manzilingizni kiriting:', {
                reply_markup: { remove_keyboard: true }
            });
        });
    }

    private async handleOrderSteps(ctx: Context, session: SessionData, userId: number, text: string) {
    try {
        switch (session.step) {
            case 'order_address':
                session.orderData = {
                    ...session.orderData,
                    address: text
                };
                session.step = 'order_paymentType';
                this.sessions.set(userId, session);

                await ctx.reply('Toʻlov turini tanlang:', {
                    reply_markup: {
                        keyboard: [['Naqd', 'Karta']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                break;

            case 'order_paymentType':
                if (text !== 'Naqd' && text !== 'Karta') {
                    await ctx.reply('Iltimos, toʻlov turini tanlang klaviaturadan.');
                    return;
                }
                session.orderData = {
                    ...session.orderData,
                    paymentType: text === 'Naqd' ? 'Cash' : 'Credit Card'
                };
                session.step = 'order_withDelivery';
                this.sessions.set(userId, session);

                await ctx.reply('Yetkazib berish xizmatini xohlaysizmi?', {
                    reply_markup: {
                        keyboard: [['Ha', 'Yoʻq']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                break;

            case 'order_withDelivery':
                if (text !== 'Ha' && text !== 'Yoʻq') {
                    await ctx.reply('Iltimos, javobni tanlang klaviaturadan.');
                    return;
                }
                session.orderData = {
                    ...session.orderData,
                    withDelivery: text === 'Ha'
                };
                session.step = 'order_commentToDelivery';
                this.sessions.set(userId, session);

                await ctx.reply('Yetkazib berish uchun izoh (agar kerak boʻlsa):', {
                    reply_markup: { remove_keyboard: true }
                });
                break;

            case 'order_commentToDelivery':
                session.orderData = {
                    ...session.orderData,
                    commentToDelivery: text
                };
                session.step = 'order_date';
                this.sessions.set(userId, session);

                await ctx.reply('Iltimos, sanani kiriting (masalan: 2025.06.01-10:00):', {
                    reply_markup: { remove_keyboard: true }
                });
                break;

            case 'order_date':
                const dateRegex = /^(\d{4})\.(\d{2})\.(\d{2})-(\d{2}):(\d{2})$/;
                if (!dateRegex.test(text)) {
                    await ctx.reply('Notoʻgʻri format. Iltimos, quyidagi formatda kiriting: 2025.06.01-10:00');
                    return;
                }

                const [, year, month, day, hours, minutes] = text.match(dateRegex)!;
                const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
                if (isNaN(date.getTime()) || date < new Date()) {
                    await ctx.reply('Notoʻgʻri yoki oʻtgan sana. Iltimos, toʻgʻri sana kiriting.');
                    return;
                }

                session.orderData = {
                    ...session.orderData,
                    date: date.toISOString()
                };
                session.step = 'order_product';
                this.sessions.set(userId, session);

                const products = await this.prisma.product.findMany({ select: { id: true, name: true } });
                const productButtons = products.map(p => [Markup.button.text(p.name || `Product ${p.id}`)]);

                await ctx.reply('Sizga qanday odmalar kerak:', {
                    reply_markup: {
                        keyboard: productButtons,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                break;

            case 'order_product':
                const product = await this.prisma.product.findFirst({
                    where: { name: text }
                });

                if (!product) {
                    await ctx.reply('Notoʻgʻri xizmat turi. Iltimos, tanlang klaviaturadan.');
                    return;
                }

                session.orderData = {
                    ...session.orderData,
                    orderProducts: { productId: product.id, levelId: 0, quantity: 0 }
                };
                session.step = 'order_level';
                this.sessions.set(userId, session);

                const levels = await this.prisma.level.findMany({ select: { id: true, name: true } });
                const levelButtons = levels.map(l => [Markup.button.text(l.name || `Level ${l.id}`)]);

                await ctx.reply('Xizmat darajasini tanlang:', {
                    reply_markup: {
                        keyboard: levelButtons,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                break;

            case 'order_level':
                const level = await this.prisma.level.findFirst({
                    where: { name: text }
                });

                if (!level) {
                    await ctx.reply('Notoʻgʻri daraja. Iltimos, tanlang klaviaturadan.');
                    return;
                }

                if (!session.orderData) {
                    await ctx.reply('Xatolik yuz berdi. Iltimos, /order buyrug‘ini qayta bajaring.', {
                        reply_markup: { remove_keyboard: true }
                    });
                    this.sessions.delete(userId);
                    return;
                }

                session.orderData = {
                    ...session.orderData,
                    orderProducts: { ...session.orderData.orderProducts!, levelId: level.id }
                };
                session.step = 'order_quantity';
                this.sessions.set(userId, session);

                await ctx.reply('Miqdorni kiriting:', {
                    reply_markup: { remove_keyboard: true }
                });
                break;

            case 'order_quantity':
                const quantity = parseInt(text);
                if (isNaN(quantity) || quantity <= 0) {
                    await ctx.reply('Iltimos, toʻgʻri miqdor kiriting (musbat butun son).');
                    return;
                }

                if (!session.orderData) {
                    await ctx.reply('Xatolik yuz berdi. Iltimos, /order buyrug‘ini qayta bajaring.', {
                        reply_markup: { remove_keyboard: true }
                    });
                    this.sessions.delete(userId);
                    return;
                }

                session.orderData = {
                    ...session.orderData,
                    orderProducts: { ...session.orderData.orderProducts!, quantity }
                };
                session.step = 'order_needTools';
                this.sessions.set(userId, session);

                await ctx.reply('Asboblar ham buyurtma qilasizmi?', {
                    reply_markup: {
                        keyboard: [['Ha', 'Yoʻq']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                break;

            case 'order_needTools':
                if (text !== 'Ha' && text !== 'Yoʻq') {
                    await ctx.reply('Iltimos, javobni tanlang klaviaturadan.');
                    return;
                }

                if (text === 'Yoʻq') {
                    await this.finalizeOrder(ctx, session, userId);
                    return;
                }

                session.step = 'order_tool';
                this.sessions.set(userId, session);

                const tools = await this.prisma.tool.findMany({ select: { id: true, name: true } });
                const toolButtons = tools.map(t => [Markup.button.text(t.name || `Tool ${t.id}`)]);
                toolButtons.push([Markup.button.text('Buyurtmani yakunlash')]);

                await ctx.reply('Asbob turini tanlang:', {
                    reply_markup: {
                        keyboard: toolButtons,
                        resize_keyboard: true,
                        one_time_keyboard: true // Make the keyboard one-time
                    }
                });
                break;

            case 'order_tool':
                if (text === 'Buyurtmani yakunlash') {
                    await this.finalizeOrder(ctx, session, userId);
                    return;
                }

                const tool = await this.prisma.tool.findFirst({
                    where: { name: text }
                });

                if (!tool) {
                    await ctx.reply('Notoʻgʻri asbob turi. Iltimos, tanlang klaviaturadan.');
                    return;
                }

                session.orderData = {
                    ...session.orderData,
                    currentTool: tool.id
                };
                session.step = 'order_toolQuantity';
                this.sessions.set(userId, session);

                await ctx.reply('Asbob miqdorini kiriting:', {
                    reply_markup: { remove_keyboard: true }
                });
                break;

            case 'order_toolQuantity':
                const toolQuantity = parseInt(text);
                if (isNaN(toolQuantity) || toolQuantity <= 0) {
                    await ctx.reply('Iltimos, toʻgʻri miqdor kiriting (musbat butun son).');
                    return;
                }

                const toolId = session.orderData?.currentTool;
                if (!toolId) {
                    await ctx.reply('Xatolik yuz berdi. Iltimos, /order buyrug‘ini qayta bajaring.', {
                        reply_markup: { remove_keyboard: true }
                    });
                    this.sessions.delete(userId);
                    return;
                }

                const orderTools = session.orderData?.orderTools || [];
                const existingTool = orderTools.find(t => t.toolId === toolId);
                if (existingTool) {
                    existingTool.quantity += toolQuantity;
                } else {
                    orderTools.push({ toolId, quantity: toolQuantity });
                }

                session.orderData = {
                    ...session.orderData,
                    orderTools,
                    currentTool: undefined
                };
                session.step = 'order_tool';
                this.sessions.set(userId, session);

                const toolsAgain = await this.prisma.tool.findMany({ select: { id: true, name: true } });
                const toolButtonsAgain = toolsAgain.map(t => [Markup.button.text(t.name || `Tool ${t.id}`)]);
                toolButtonsAgain.push([Markup.button.text('Buyurtmani yakunlash')]);

                await ctx.reply('Asbob qoʻshildi. Yana asbob qoʻshasizmi yoki buyurtmani yakunlaysizmi?', {
                    reply_markup: {
                        keyboard: toolButtonsAgain,
                        resize_keyboard: true,
                        one_time_keyboard: true // Make the keyboard one-time
                    }
                });
                break;
        }
    } catch (error) {
        console.error(`Order step error for user ${userId}:`, error);
        await ctx.reply('Buyurtma jarayonida xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.', {
            reply_markup: { remove_keyboard: true } // Remove keyboard on error
        });
        this.sessions.delete(userId);
    }
}

    private async finalizeOrder(ctx: Context, session: SessionData, userId: number) {
        if (!session.orderData || !session.userId) {
            await ctx.reply('Xatolik yuz berdi. Iltimos, /order buyrug‘ini qayta bajaring.');
            this.sessions.delete(userId);
            return;
        }

        const { location, address, paymentType, withDelivery, date, orderProducts, orderTools, commentToDelivery } = session.orderData;
        if (!location || !address || !paymentType || withDelivery === undefined || !date || !orderProducts?.productId || !orderProducts?.levelId || !orderProducts?.quantity) {
            await ctx.reply('Barcha kerakli maydonlar to‘ldirilmagan. Iltimos, /order buyrug‘ini qayta bajaring.');
            this.sessions.delete(userId);
            return;
        }

        try {
            const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
            if (!user) {
                await ctx.reply('Foydalanuvchi topilmadi. Iltimos, qayta /login qiling.');
                this.sessions.delete(userId);
                return;
            }

            const product = await this.prisma.product.findUnique({ where: { id: orderProducts.productId } });
            const level = await this.prisma.level.findUnique({ where: { id: orderProducts.levelId } });
            if (!product || !level) {
                await ctx.reply('Xizmat yoki daraja topilmadi. Iltimos, qayta /order buyrug‘ini bajaring.');
                this.sessions.delete(userId);
                return;
            }

            let totalPrice = product.priceHourly * orderProducts.quantity;
            if (orderTools) {
                for (const tool of orderTools) {
                    const toolRecord = await this.prisma.tool.findUnique({ where: { id: tool.toolId } });
                    if (!toolRecord) {
                        await ctx.reply(`Asbob (ID: ${tool.toolId}) topilmadi.`);
                        this.sessions.delete(userId);
                        return;
                    }
                    if (tool.quantity > toolRecord.quantity) {
                        await ctx.reply(`Asbob (ID: ${tool.toolId}) uchun yetarli miqdor yo‘q. Qoldiq: ${toolRecord.quantity}`);
                        this.sessions.delete(userId);
                        return;
                    }
                    totalPrice += toolRecord.price * tool.quantity;
                }
            }

            const orderData = {
                location,
                address,
                paymentType,
                withDelivery,
                commentToDelivery: commentToDelivery || '',
                date: new Date(date),
                OrderProducts: {
                    productId: orderProducts.productId,
                    levelId: orderProducts.levelId,
                    quantity: orderProducts.quantity
                },
                OrderTools: orderTools || [],
                quantity: orderProducts.quantity,
                totalPrice,
            };

            const fakeReq = { user: { id: session.userId } } as any;
            const result = await this.orderService.order(orderData, fakeReq);

            await ctx.reply(`Buyurtma muvaffaqiyatli yaratildi! Buyurtma ID: ${result.newOrder.id}`);
            await ctx.reply(JSON.stringify(result.newOrder, null, 2));
            await ctx.replyWithSticker("CAACAgIAAxkBAAIBEWgy64fBk56u5kvCbTCIHiNV9gEeAAJ8YgACPSQJSeLkTIqGW4xCNgQ");

            this.sessions.set(userId, {
                accessToken: session.accessToken,
                refreshToken: session.refreshToken,
                userId: session.userId,
                createdAt: session.createdAt,
            });
        } catch (error) {
            console.error(`Order creation error for user ${userId}:`, error);
            await ctx.reply(`Buyurtma yaratishda xatolik yuz berdi: ${error.message}`);
            this.sessions.delete(userId);
        }
    }
}
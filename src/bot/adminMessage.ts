import { Start, Update, Hears, On, InjectBot } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from '../order/order.service';
import { Context, Markup, session, Telegraf } from 'telegraf';

interface SessionData {
  step?: string;
  selectedOrderId?: number;
  selectedMasters?: number[];
  mastersNeeded?: number;
  selectedRestaurantId?: string;
}

interface MyContext extends Context {
  session: SessionData;
}

@Update()
export class AdminMessage {
  private readonly ADMIN_IDS = [7686369489]; // Replace with your Telegram ID

  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
    @InjectBot('AdminBot') private bot: Telegraf<MyContext>,
  ) {
    this.bot.use(session({ defaultSession: () => ({}) }));
  }

  async onModuleInit() {
    try {
      await this.bot.telegram.setMyCommands([
        { command: 'orders', description: 'See all orders' },
        { command: 'seedisconnected', description: 'See orders without masters' },
        { command: 'connectworker', description: 'Connect workers to an order' },
      ]);
    } catch (error) {
      console.error('Failed to set bot commands:', error);
    }
  }

  @Start()
  async onStart(ctx: MyContext) {
    try {
      if (!ctx.from?.id || !this.ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply('Sizda admin ruxsati yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }
      await ctx.reply(`Hush kelibsiz Boss ${ctx.from?.first_name} 🤗`, {
        reply_markup: { remove_keyboard: true },
      });
    } catch (error) {
      console.error('Error in onStart:', error);
      await ctx.reply(
        `Xatolik yuz berdi: ${(error as Error).message || 'Noma\'lum xato'}`,
        { reply_markup: { remove_keyboard: true },}
      );
    }
  }

  @Hears('orders')
  async onOrders(ctx: MyContext) {
    try {
      if (!ctx.from?.id || !this.ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply('Sizda admin ruxsati yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }
      const ordersResponse = await this.orderService.findAll({ page: 1, limit: 100 });
      const orders = ordersResponse.data;

      if (orders.length === 0) {
        await ctx.reply('Hozirda buyurtmalar yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }

      await ctx.reply(`Barcha buyurtmalar (Jami: ${ordersResponse.total}):`, {
        reply_markup: { remove_keyboard: true },
      });

      for (const order of orders) {
        const tools = order.Tools?.map((t) => t.name).join(', ') || 'Yo‘q';
        const masters = order.Masters?.map((m) => m.name).join(', ') || 'Yo‘q';
        const orderWithProducts = await this.prisma.order.findUnique({
          where: { id: order.id },
          include: { Products: true },
        });
        const products = orderWithProducts?.Products?.map((p) => `${p.name} (x${order.quantity})`).join(', ') || 'Yo‘q';

        const orderDetails = [
          `📋 Buyurtma ID: ${order.id}`,
          `📅 Sana: ${new Date(order.date).toLocaleString('uz-UZ')}`,
          `📍 Manzil: ${order.address}`,
          `💳 Toʻlov turi: ${order.paymentType}`,
          `🚚 Yetkazib berish: ${order.withDelivery ? 'Ha' : 'Yoʻq'}`,
          `💬 Izoh: ${order.commentToDelivery || 'Yoʻq'}`,
          `🧹 Xizmat: ${products}`,
          `🛠 Asboblar: ${tools}`,
          `👷 Usta: ${masters}`,
          `💰 Umumiy narx: ${order.totalPrice} soʻm`,
          `📊 Holat: ${order.status}`,
        ].join('\n');

        await ctx.reply(orderDetails, {
          reply_markup: { remove_keyboard: true },
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      await ctx.reply('Buyurtmalarni olishda xatolik yuz berdi.', {
        reply_markup: { remove_keyboard: true },}
      );
    }
  }

  @Hears('seedisconnected')
  async onSeeDisconnectedOrders(ctx: MyContext) {
    try {
      if (!ctx.from?.id || !this.ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply('Sizda admin ruxsati yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }
      const orders = await this.prisma.order.findMany({
        where: { Masters: { none: {} } },
        include: { Tools: true, Products: true },
      });

      if (orders.length === 0) {
        await ctx.reply('Ustasi bo‘lmagan buyurtmalar yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }

      await ctx.reply(`Ustasi bo‘lmagan buyurtmalar (Jami: ${orders.length}):`, {
        reply_markup: { remove_keyboard: true },
      });

      for (const order of orders) {
        const tools = order.Tools?.map((t) => t.name).join(', ') || 'Yo‘q';
        const products = order.Products?.map((p) => `${p.name} (x${order.quantity})`).join(', ') || 'Yo‘q';

        const orderDetails = [
          `📋 Buyurtma ID: ${order.id}`,
          `📅 Sana: ${new Date(order.date).toLocaleString('uz-UZ')}`,
          `📍 Manzil: ${order.address}`,
          `💳 Toʻlov turi: ${order.paymentType}`,
          `🚚 Yetkazib berish: ${order.withDelivery ? 'Ha' : 'Yoʻq'}`,
          `💬 Izoh: ${order.commentToDelivery || 'Yoʻq'}`,
          `🧹 Xizmat: ${products}`,
          `🛠 Asboblar: ${tools}`,
          `👷 Usta: Yo‘q`,
          `💰 Umumiy narx: ${order.totalPrice} soʻm`,
          `📊 Holat: ${order.status}`,
        ].join('\n');

        await ctx.reply(orderDetails, {
          reply_markup: { remove_keyboard: true },
        });
      }
    } catch (error) {
      console.error('Error fetching disconnected orders:', error);
      await ctx.reply('Buyurtmalarni olishda xatolik yuz berdi.', {
        reply_markup: { remove_keyboard: true },}
      );
    }
  }

  @Hears('connectworker')
  async onConnectWorker(ctx: MyContext) {
    try {
      if (!ctx.from?.id || !this.ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply('Sizda admin ruxsati yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }
      const orders = await this.prisma.order.findMany({
        where: { Masters: { none: {} } },
        select: { id: true },
      });

      if (orders.length === 0) {
        await ctx.reply('Ustasi bo‘lmagan buyurtmalar yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }

      ctx.session.step = 'select_order';
      const orderButtons = orders.map((order) => [Markup.button.text(order.id.toString())]);

      await ctx.reply('Ustasi bo‘lmagan buyurtmalarni tanlang:', {
        reply_markup: {
          keyboard: orderButtons,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } catch (error) {
      console.error('Error in connectWorker:', error);
      await ctx.reply('Xatolik yuz berdi.', {
        reply_markup: { remove_keyboard: true },
      }
      );
    }
  }

  @On('text')
  async onText(ctx: MyContext) {
    try {
      if (!ctx.from?.id || !this.ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply('Sizda admin ruxsati yo‘q.', {
          reply_markup: { remove_keyboard: true },
        });
        return;
      }
      if (!ctx.message || !('text' in ctx.message)) return;
      const text = ctx.message.text;

      if (ctx.session.step === 'select_order') {
        const orderId = parseInt(text);
        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
          include: { Products: true, Masters: true},
        });

        if (!order || order.Masters.length > 0) {
          await ctx.reply('Noto‘g‘ri buyurtma ID yoki buyurtmada allaqachon usta bor.', {
            reply_markup: { remove_keyboard: true },
          });
          ctx.session.step = undefined;
          return;
        }

        const mastersNeeded = order.quantity || 1;
        ctx.session.selectedOrderId = orderId;
        ctx.session.mastersNeeded = mastersNeeded;
        ctx.session.selectedMasters = [];
        ctx.session.step = 'select_master';

        await this.showMasterSelection(ctx);
      } else if (ctx.session.step === 'select_master') {
        const [masterName, levelName] = text.split(' - ');
        const master = await this.prisma.master.findFirst({
          where: { name: masterName, Level: { name: levelName } },
          include: { Level: true },
        });

        if (!master) {
          await ctx.reply('Noto‘g‘ri usta tanlandi. Qaytadan tanlang:', {
            reply_markup: { remove_keyboard: true },
          });
          await this.showMasterSelection(ctx);
          return;
        }

        ctx.session.selectedMasters!.push(master.id);

        if (ctx.session.selectedMasters!.length < ctx.session.mastersNeeded!) {
          await ctx.reply(
            `Usta tanlandi: ${master.name}. Yana ${ctx.session.mastersNeeded! - ctx.session.selectedMasters!.length} ta usta tanlang:`,
            { reply_markup: { remove_keyboard: true } },
          );
          await this.showMasterSelection(ctx);
        } else {
          const data = {
            orderId: ctx.session.selectedOrderId!,
            mastersId: ctx.session.selectedMasters!,
          };

          const result = await this.orderService.ConnectWorker(data);
          await ctx.reply(
            `Buyurtma ${data.orderId} ga ${data.mastersId.length} ta usta muvaffaqiyatli bog‘landi! Umumiy narx: ${result.totalCost} so‘m`,
            { reply_markup: { remove_keyboard: true } },
          );

          ctx.session.step = undefined;
          ctx.session.selectedOrderId = undefined;
          ctx.session.mastersNeeded = undefined;
          ctx.session.selectedMasters = undefined;
        }
      } else {
        await ctx.reply('Noma‘lum buyruq. /orders, /seedisconnected yoki /connectworker ni sinab ko‘ring.', {
          reply_markup: { remove_keyboard: true },
        });
      }
    } catch (error) {
      console.error('Error in onText:', error);
      await ctx.reply('Xatolik yuz berdi.', {
        reply_markup: { remove_keyboard: true },
      }
      );
      ctx.session.step = undefined;
    }
  }

  private async showMasterSelection(ctx: MyContext) {
    const masters = await this.prisma.master.findMany({
      where: { isActive: true },
      include: { Level: true },
    });

    if (masters.length === 0) {
      await ctx.reply('Hozirda faol ustalar yo‘q.', {
        reply_markup: { remove_keyboard: true },
      });
      ctx.session.step = undefined;
      return;
    }

    const masterButtons = masters.map((master) => [Markup.button.text(`${master.name} - ${master.Level?.name}`)]);

    await ctx.reply('Usta tanlang:', {
      reply_markup: {
        keyboard: masterButtons,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
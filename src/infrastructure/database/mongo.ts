import mongoose from 'mongoose';

export class MongoConnection {
  static async connect(): Promise<void> {
    const uri = process.env.MONGO_URI || 'mongodb://root:prosol2026@localhost:27017/prosol_db?authSource=admin';

    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(uri);
      console.log('🔌 [Database] Conexão com MongoDB estabelecida com sucesso!');
    } catch (error) {
      console.error('❌ [Database] Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('🔌 [Database] Conexão com MongoDB encerrada.');
  }
}
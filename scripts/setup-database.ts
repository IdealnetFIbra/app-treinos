/**
 * Script para criar a tabela users no Supabase
 * Execute: npx tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...')

  try {
    // Criar tabela users
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Criar tabela users
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          unit TEXT,
          avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Criar índice para busca por email
        CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

        -- Habilitar RLS (Row Level Security)
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Política: Usuários podem ler seus próprios dados
        DROP POLICY IF EXISTS "Users can read own data" ON public.users;
        CREATE POLICY "Users can read own data" ON public.users
          FOR SELECT
          USING (auth.uid() = id);

        -- Política: Usuários podem inserir seus próprios dados
        DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
        CREATE POLICY "Users can insert own data" ON public.users
          FOR INSERT
          WITH CHECK (auth.uid() = id);

        -- Política: Usuários podem atualizar seus próprios dados
        DROP POLICY IF EXISTS "Users can update own data" ON public.users;
        CREATE POLICY "Users can update own data" ON public.users
          FOR UPDATE
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);

        -- Função para atualizar updated_at automaticamente
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Trigger para atualizar updated_at
        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON public.users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    })

    if (error) {
      console.error('❌ Erro ao criar tabela:', error)
      throw error
    }

    console.log('✅ Tabela users criada com sucesso!')
    console.log('✅ Políticas RLS configuradas!')
    console.log('✅ Banco de dados pronto para uso!')

  } catch (error) {
    console.error('❌ Erro na configuração:', error)
    process.exit(1)
  }
}

setupDatabase()

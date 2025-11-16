import { supabase } from './supabase'

export interface Cliente {
  id: string
  nome: string
  email?: string
  telefone: string
  total_compras: number
  created_at?: string
  updated_at?: string
}

// Buscar todos os clientes
export async function buscarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Cliente[]
}

// Adicionar novo cliente
export async function adicionarCliente(cliente: Omit<Cliente, 'id' | 'total_compras' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([{
      nome: cliente.nome,
      email: cliente.email || null,
      telefone: cliente.telefone,
      total_compras: 0
    }])
    .select()
    .single()

  if (error) throw error
  return data as Cliente
}

// Atualizar cliente
export async function atualizarCliente(id: string, cliente: Partial<Cliente>) {
  const { data, error } = await supabase
    .from('clientes')
    .update({
      nome: cliente.nome,
      email: cliente.email || null,
      telefone: cliente.telefone,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Cliente
}

// Excluir cliente
export async function excluirCliente(id: string) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Buscar cliente por ID
export async function buscarClientePorId(id: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Cliente
}

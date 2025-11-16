"use client"

import { useState } from "react"
import { 
  LayoutDashboard, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCog, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Search
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Tipos
interface Produto {
  id: string
  nome: string
  preco: number
  quantidade: number
  categoria: string
}

interface Venda {
  id: string
  data: string
  produtos: { produtoId: string; quantidade: number; preco: number }[]
  clienteId?: string
  total: number
  formaPagamento: string
}

interface Cliente {
  id: string
  nome: string
  telefone: string
  totalCompras: number
}

interface Funcionario {
  id: string
  nome: string
  cargo: string
  salario: number
  dataAdmissao: string
}

interface ContaPagar {
  id: string
  descricao: string
  valor: number
  vencimento: string
  status: "pendente" | "paga"
}

interface ContaReceber {
  id: string
  descricao: string
  valor: number
  vencimento: string
  status: "pendente" | "recebida"
}

export default function GestorPro() {
  // Estados - TODOS VAZIOS
  const [activeTab, setActiveTab] = useState("dashboard")
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([])
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>([])

  // Dados vazios para gráficos
  const dadosVendasMensais = [
    { mes: "Jul", vendas: 0 },
    { mes: "Ago", vendas: 0 },
    { mes: "Set", vendas: 0 },
    { mes: "Out", vendas: 0 },
    { mes: "Nov", vendas: 0 },
    { mes: "Dez", vendas: 0 },
    { mes: "Jan", vendas: 0 },
  ]

  // Cálculos Dashboard - TODOS ZERADOS
  const faturamentoDia = 0
  const faturamentoMes = 0
  const faturamentoAno = 0
  const despesasMes = 0
  const lucroMes = 0

  // Funções CRUD Produtos
  const adicionarProduto = (produto: Omit<Produto, "id">) => {
    const novoProduto = { ...produto, id: Date.now().toString() }
    setProdutos([...produtos, novoProduto])
  }

  const editarProduto = (id: string, produtoAtualizado: Produto) => {
    setProdutos(produtos.map(p => p.id === id ? produtoAtualizado : p))
  }

  const excluirProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id))
  }

  // Funções CRUD Vendas
  const adicionarVenda = (venda: Omit<Venda, "id">) => {
    const novaVenda = { ...venda, id: Date.now().toString() }
    setVendas([...vendas, novaVenda])
  }

  // Funções CRUD Clientes
  const adicionarCliente = (cliente: Omit<Cliente, "id" | "totalCompras">) => {
    const novoCliente = { ...cliente, id: Date.now().toString(), totalCompras: 0 }
    setClientes([...clientes, novoCliente])
  }

  const editarCliente = (id: string, clienteAtualizado: Cliente) => {
    setClientes(clientes.map(c => c.id === id ? clienteAtualizado : c))
  }

  const excluirCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id))
  }

  // Funções CRUD Funcionários
  const adicionarFuncionario = (funcionario: Omit<Funcionario, "id">) => {
    const novoFuncionario = { ...funcionario, id: Date.now().toString() }
    setFuncionarios([...funcionarios, novoFuncionario])
  }

  const editarFuncionario = (id: string, funcionarioAtualizado: Funcionario) => {
    setFuncionarios(funcionarios.map(f => f.id === id ? funcionarioAtualizado : f))
  }

  const excluirFuncionario = (id: string) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GestorPro
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sistema de Gestão Empresarial</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Sistema Ativo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="estoque" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Estoque</span>
            </TabsTrigger>
            <TabsTrigger value="vendas" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="funcionarios" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              <span className="hidden sm:inline">Funcionários</span>
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA 1: DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Faturamento Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-xs opacity-80 mt-1">Vendas do dia</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Faturamento Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-xs opacity-80 mt-1">Nenhuma venda registrada</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Faturamento Ano</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-xs opacity-80 mt-1">Janeiro 2025</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Lucro Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-xs opacity-80 mt-1">Receita - Despesas</p>
                </CardContent>
              </Card>
            </div>

            {/* Métricas Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-500" />
                    Despesas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ 0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    Produtos em Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">0</div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Vendas</CardTitle>
                <CardDescription>Faturamento mensal dos últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] text-slate-400">
                  <p>Nenhuma venda registrada ainda</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 2: FINANCEIRO */}
          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader>
                  <CardTitle>Contas a Receber</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-sm opacity-80 mt-1">Nenhuma conta pendente</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader>
                  <CardTitle>Contas a Pagar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-sm opacity-80 mt-1">Nenhuma conta pendente</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle>Fluxo de Caixa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 0</div>
                  <p className="text-sm opacity-80 mt-1">Saldo do mês</p>
                </CardContent>
              </Card>
            </div>

            {/* Contas a Pagar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Contas a Pagar
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Conta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Conta a Pagar</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        setContasPagar([...contasPagar, {
                          id: Date.now().toString(),
                          descricao: formData.get('descricao') as string,
                          valor: Number(formData.get('valor')),
                          vencimento: formData.get('vencimento') as string,
                          status: "pendente"
                        }])
                        e.currentTarget.reset()
                      }} className="space-y-4">
                        <div>
                          <Label>Descrição</Label>
                          <Input name="descricao" required />
                        </div>
                        <div>
                          <Label>Valor</Label>
                          <Input name="valor" type="number" step="0.01" required />
                        </div>
                        <div>
                          <Label>Vencimento</Label>
                          <Input name="vencimento" type="date" required />
                        </div>
                        <Button type="submit" className="w-full">Adicionar</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contasPagar.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p>Nenhuma conta a pagar cadastrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contasPagar.map(conta => (
                      <div key={conta.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium">{conta.descricao}</p>
                          <p className="text-sm text-slate-500">Vencimento: {new Date(conta.vencimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-red-600">R$ {conta.valor.toLocaleString('pt-BR')}</p>
                            <Badge variant={conta.status === "paga" ? "default" : "destructive"}>
                              {conta.status}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setContasPagar(contasPagar.map(c => 
                                c.id === conta.id ? { ...c, status: c.status === "paga" ? "pendente" : "paga" } : c
                              ))
                            }}
                          >
                            {conta.status === "paga" ? "Marcar Pendente" : "Marcar Paga"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contas a Receber */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Contas a Receber
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Conta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Conta a Receber</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        setContasReceber([...contasReceber, {
                          id: Date.now().toString(),
                          descricao: formData.get('descricao') as string,
                          valor: Number(formData.get('valor')),
                          vencimento: formData.get('vencimento') as string,
                          status: "pendente"
                        }])
                        e.currentTarget.reset()
                      }} className="space-y-4">
                        <div>
                          <Label>Descrição</Label>
                          <Input name="descricao" required />
                        </div>
                        <div>
                          <Label>Valor</Label>
                          <Input name="valor" type="number" step="0.01" required />
                        </div>
                        <div>
                          <Label>Vencimento</Label>
                          <Input name="vencimento" type="date" required />
                        </div>
                        <Button type="submit" className="w-full">Adicionar</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contasReceber.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p>Nenhuma conta a receber cadastrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contasReceber.map(conta => (
                      <div key={conta.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium">{conta.descricao}</p>
                          <p className="text-sm text-slate-500">Vencimento: {new Date(conta.vencimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-green-600">R$ {conta.valor.toLocaleString('pt-BR')}</p>
                            <Badge variant={conta.status === "recebida" ? "default" : "secondary"}>
                              {conta.status}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setContasReceber(contasReceber.map(c => 
                                c.id === conta.id ? { ...c, status: c.status === "recebida" ? "pendente" : "recebida" } : c
                              ))
                            }}
                          >
                            {conta.status === "recebida" ? "Marcar Pendente" : "Marcar Recebida"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 3: ESTOQUE */}
          <TabsContent value="estoque" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gerenciamento de Estoque
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Produto</DialogTitle>
                        <DialogDescription>Adicione um novo produto ao estoque</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        adicionarProduto({
                          nome: formData.get('nome') as string,
                          preco: Number(formData.get('preco')),
                          quantidade: Number(formData.get('quantidade')),
                          categoria: formData.get('categoria') as string,
                        })
                        e.currentTarget.reset()
                      }} className="space-y-4">
                        <div>
                          <Label>Nome do Produto</Label>
                          <Input name="nome" required />
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <Input name="preco" type="number" step="0.01" required />
                        </div>
                        <div>
                          <Label>Quantidade</Label>
                          <Input name="quantidade" type="number" required />
                        </div>
                        <div>
                          <Label>Categoria</Label>
                          <Input name="categoria" required />
                        </div>
                        <Button type="submit" className="w-full">Adicionar Produto</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Buscar produtos..." className="pl-10" />
                  </div>
                </div>
                {produtos.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto cadastrado no estoque</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {produtos.map(produto => (
                      <div key={produto.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-slate-500">{produto.categoria}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-green-600">R$ {produto.preco.toLocaleString('pt-BR')}</p>
                            <p className="text-sm text-slate-500">Estoque: {produto.quantidade}</p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Produto</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  editarProduto(produto.id, {
                                    id: produto.id,
                                    nome: formData.get('nome') as string,
                                    preco: Number(formData.get('preco')),
                                    quantidade: Number(formData.get('quantidade')),
                                    categoria: formData.get('categoria') as string,
                                  })
                                }} className="space-y-4">
                                  <div>
                                    <Label>Nome</Label>
                                    <Input name="nome" defaultValue={produto.nome} required />
                                  </div>
                                  <div>
                                    <Label>Preço</Label>
                                    <Input name="preco" type="number" step="0.01" defaultValue={produto.preco} required />
                                  </div>
                                  <div>
                                    <Label>Quantidade</Label>
                                    <Input name="quantidade" type="number" defaultValue={produto.quantidade} required />
                                  </div>
                                  <div>
                                    <Label>Categoria</Label>
                                    <Input name="categoria" defaultValue={produto.categoria} required />
                                  </div>
                                  <Button type="submit" className="w-full">Salvar</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => excluirProduto(produto.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 4: VENDAS */}
          <TabsContent value="vendas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Registro de Vendas
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={produtos.length === 0}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Venda
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Registrar Nova Venda</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const produtoId = formData.get('produto') as string
                        const quantidade = Number(formData.get('quantidade'))
                        const produto = produtos.find(p => p.id === produtoId)
                        
                        if (produto) {
                          adicionarVenda({
                            data: new Date().toISOString().split('T')[0],
                            produtos: [{ produtoId, quantidade, preco: produto.preco }],
                            total: produto.preco * quantidade,
                            formaPagamento: formData.get('formaPagamento') as string,
                            clienteId: formData.get('cliente') as string || undefined,
                          })
                          e.currentTarget.reset()
                        }
                      }} className="space-y-4">
                        <div>
                          <Label>Produto</Label>
                          <Select name="produto" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {produtos.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.nome} - R$ {p.preco.toLocaleString('pt-BR')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantidade</Label>
                          <Input name="quantidade" type="number" min="1" required />
                        </div>
                        <div>
                          <Label>Cliente (Opcional)</Label>
                          <Select name="cliente">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clientes.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Forma de Pagamento</Label>
                          <Select name="formaPagamento" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                              <SelectItem value="Cartão">Cartão</SelectItem>
                              <SelectItem value="PIX">PIX</SelectItem>
                              <SelectItem value="Boleto">Boleto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Registrar Venda</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vendas.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma venda registrada</p>
                    {produtos.length === 0 && (
                      <p className="text-sm mt-2">Cadastre produtos no estoque primeiro</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendas.map(venda => {
                      const produto = produtos.find(p => p.id === venda.produtos[0]?.produtoId)
                      return (
                        <div key={venda.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div>
                            <p className="font-medium">Venda #{venda.id}</p>
                            <p className="text-sm text-slate-500">
                              {produto?.nome} x {venda.produtos[0]?.quantidade}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(venda.data).toLocaleDateString('pt-BR')} • {venda.formaPagamento}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-lg">R$ {venda.total.toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas de Vendas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vendas.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {vendas.length > 0 ? (vendas.reduce((acc, v) => acc + v.total, 0) / vendas.length).toLocaleString('pt-BR') : '0'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Faturamento Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {vendas.reduce((acc, v) => acc + v.total, 0).toLocaleString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ABA 5: CLIENTES */}
          <TabsContent value="clientes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Cadastro de Clientes
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cadastrar Cliente</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        adicionarCliente({
                          nome: formData.get('nome') as string,
                          telefone: formData.get('telefone') as string,
                        })
                        e.currentTarget.reset()
                      }} className="space-y-4">
                        <div>
                          <Label>Nome Completo</Label>
                          <Input name="nome" required />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input name="telefone" placeholder="(11) 98765-4321" required />
                        </div>
                        <Button type="submit" className="w-full">Cadastrar Cliente</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Buscar clientes..." className="pl-10" />
                  </div>
                </div>
                {clientes.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum cliente cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clientes.map(cliente => (
                      <div key={cliente.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                            {cliente.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-sm text-slate-500">{cliente.telefone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Total em compras</p>
                            <p className="font-bold text-green-600">R$ {cliente.totalCompras.toLocaleString('pt-BR')}</p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Cliente</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  editarCliente(cliente.id, {
                                    ...cliente,
                                    nome: formData.get('nome') as string,
                                    telefone: formData.get('telefone') as string,
                                  })
                                }} className="space-y-4">
                                  <div>
                                    <Label>Nome</Label>
                                    <Input name="nome" defaultValue={cliente.nome} required />
                                  </div>
                                  <div>
                                    <Label>Telefone</Label>
                                    <Input name="telefone" defaultValue={cliente.telefone} required />
                                  </div>
                                  <Button type="submit" className="w-full">Salvar</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => excluirCliente(cliente.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 6: FUNCIONÁRIOS */}
          <TabsContent value="funcionarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Cadastro de Funcionários
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Funcionário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cadastrar Funcionário</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        adicionarFuncionario({
                          nome: formData.get('nome') as string,
                          cargo: formData.get('cargo') as string,
                          salario: Number(formData.get('salario')),
                          dataAdmissao: formData.get('dataAdmissao') as string,
                        })
                        e.currentTarget.reset()
                      }} className="space-y-4">
                        <div>
                          <Label>Nome Completo</Label>
                          <Input name="nome" required />
                        </div>
                        <div>
                          <Label>Cargo</Label>
                          <Input name="cargo" required />
                        </div>
                        <div>
                          <Label>Salário</Label>
                          <Input name="salario" type="number" step="0.01" required />
                        </div>
                        <div>
                          <Label>Data de Admissão</Label>
                          <Input name="dataAdmissao" type="date" required />
                        </div>
                        <Button type="submit" className="w-full">Cadastrar Funcionário</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {funcionarios.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <UserCog className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum funcionário cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {funcionarios.map(funcionario => (
                      <div key={funcionario.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                            {funcionario.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{funcionario.nome}</p>
                            <p className="text-sm text-slate-500">{funcionario.cargo}</p>
                            <p className="text-xs text-slate-400">
                              Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Salário</p>
                            <p className="font-bold text-blue-600">R$ {funcionario.salario.toLocaleString('pt-BR')}</p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Funcionário</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  editarFuncionario(funcionario.id, {
                                    ...funcionario,
                                    nome: formData.get('nome') as string,
                                    cargo: formData.get('cargo') as string,
                                    salario: Number(formData.get('salario')),
                                    dataAdmissao: formData.get('dataAdmissao') as string,
                                  })
                                }} className="space-y-4">
                                  <div>
                                    <Label>Nome</Label>
                                    <Input name="nome" defaultValue={funcionario.nome} required />
                                  </div>
                                  <div>
                                    <Label>Cargo</Label>
                                    <Input name="cargo" defaultValue={funcionario.cargo} required />
                                  </div>
                                  <div>
                                    <Label>Salário</Label>
                                    <Input name="salario" type="number" step="0.01" defaultValue={funcionario.salario} required />
                                  </div>
                                  <div>
                                    <Label>Data de Admissão</Label>
                                    <Input name="dataAdmissao" type="date" defaultValue={funcionario.dataAdmissao} required />
                                  </div>
                                  <Button type="submit" className="w-full">Salvar</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => excluirFuncionario(funcionario.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas de Funcionários */}
            {funcionarios.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total de Funcionários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{funcionarios.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Folha de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      R$ {funcionarios.reduce((acc, f) => acc + f.salario, 0).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salário Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {(funcionarios.reduce((acc, f) => acc + f.salario, 0) / funcionarios.length).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ABA 7: RELATÓRIOS */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Relatórios Gerenciais
                </CardTitle>
                <CardDescription>Visualize relatórios detalhados do seu negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diario" className="space-y-4">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="diario">Diário</TabsTrigger>
                    <TabsTrigger value="semanal">Semanal</TabsTrigger>
                    <TabsTrigger value="mensal">Mensal</TabsTrigger>
                    <TabsTrigger value="anual">Anual</TabsTrigger>
                  </TabsList>

                  <TabsContent value="diario" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Vendas Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Faturamento Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Ticket Médio Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">R$ 0</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="semanal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Vendas na Semana</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Faturamento Semanal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Novos Clientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="mensal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Faturamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Despesas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Lucro</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Margem</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0%</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Desempenho Mensal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-[300px] text-slate-400">
                          <p>Nenhum dado disponível para exibir</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="anual" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Faturamento Anual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">R$ 0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Clientes Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Produtos Cadastrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Evolução Anual</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-[300px] text-slate-400">
                          <p>Nenhum dado disponível para exibir</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

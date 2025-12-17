import { useState, useEffect } from 'react';
import { User, Loader2, RefreshCw, Trash2, ArrowUpDown, Search, UserPlus, MoreHorizontal, ChevronLeft, ChevronRight, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/users';

// Credenciais fixas
const VALID_EMAIL = 'jeffinbala.29@gmail.com';
const VALID_PASSWORD = '874190ma';

interface UserData {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

type SortField = 'id' | 'name' | 'email' | 'created_at';
type SortOrder = 'asc' | 'desc';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleLogin = async () => {
    setLoginError('');
    setLoginLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginEmail === VALID_EMAIL && loginPassword === VALID_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Email ou senha incorretos. Tente novamente.');
    }

    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        setError(err.message || 'Erro inesperado ao carregar os usuários.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    setDeleteLoading(id);
    setOpenMenuId(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      }

      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      alert('Erro ao excluir usuário: ' + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'created_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [retryCount, isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Portal Nexion</h1>
              <p className="text-blue-100">Faça login para continuar</p>
            </div>

            <div className="p-8">
              {loginError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{loginError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-slate-600">Lembrar-me</span>
                  </label>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </div>


            </div>
          </div>

          <p className="text-center text-sm text-slate-600 mt-6">
            Não tem uma conta?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Tela Principal (Dashboard com Tabela)
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="w-full px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-50"></div>
                <div className="relative p-3 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portal Nexion
                </h1>
                <p className="text-sm text-slate-600 mt-1">Gerenciamento de Usuários</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRetryCount(retryCount + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Usuário</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:scale-105 transition-all duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total de Usuários</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Filtrados</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{filteredUsers.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Página Atual</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalPages > 0 ? currentPage : 0} de {totalPages}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
            <p className="text-red-800">
              <strong>Erro:</strong> {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600 text-lg">Carregando usuários...</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('id')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        ID
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        Nome
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('email')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        Email
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('created_at')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        Data de Criação
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg text-blue-700 text-sm font-semibold">
                            {user.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(user.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-5 h-5 text-slate-600" />
                            </button>

                            {openMenuId === user.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20">
                                  <div className="px-4 py-2 text-sm font-semibold text-slate-700 border-b border-slate-200">
                                    Ações
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(user.email);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                  >
                                    Copiar email
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    disabled={deleteLoading === user.id}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    {deleteLoading === user.id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Excluindo...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="w-4 h-4" />
                                        Excluir usuário
                                      </>
                                    )}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <User className="w-12 h-12 text-slate-400 mb-3" />
                          <p className="text-slate-600 text-lg font-semibold">Nenhum resultado encontrado</p>
                          <p className="text-sm text-slate-400 mt-1">Tente ajustar sua busca</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Exibindo {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} resultados
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
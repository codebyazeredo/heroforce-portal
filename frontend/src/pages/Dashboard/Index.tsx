import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { UserRole } from '../../../../backend/src/users/enums/user-role.enum';
import { DashboardFilters } from './components/DashboardFilters';
import { ProjectTable } from './components/ProjectTable';
import { CreateProjectModal } from './components/ProjectModal';
import { Pagination } from './components/Pagination';
import { DashboardHeader } from './components/DashboardHeader';
import { ApiErrorState } from '../../shared/ApiErrorState';
import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [heroes, setHeroes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterHero, setFilterHero] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [apiError, setApiError] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === UserRole.ADMIN;

    const fetchData = useCallback(async () => {
        if (!user) return;

        setApiError(false);
        setLoading(true);
        try {
            const [projRes, heroRes] = await Promise.all([
                api.get('/projects'),
                api.get('/users').catch(e => {
                    console.error("Erro ao buscar heróis:", e);
                    return { data: [] };
                })
            ]);

            setProjects(projRes.data);
            setHeroes(heroRes.data);
        } catch (e) {
            console.error("Erro ao buscar dados do dashboard:", e);
            setApiError(true);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { 
        fetchData(); 
    }, [fetchData]);

    const filteredProjects = useMemo(() => {
        return projects.filter((p: any) => {
            const matchStatus = filterStatus !== "" ? p.status === Number(filterStatus) : true;
            const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchHero = filterHero ? String(p.responsible?.id) === filterHero : true;
            return matchStatus && matchSearch && matchHero;
        });
    }, [projects, filterStatus, searchTerm, filterHero]);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
    const paginatedProjects = useMemo(() => {
        return filteredProjects.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredProjects, currentPage]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Confirmar exclusão?")) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchData();
        } catch (e) {
            alert("Erro ao excluir projeto.");
        }
    };

    if (!user) return null;
    if (apiError) return <ApiErrorState onRetry={fetchData} />;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-slate-500 font-medium">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DashboardHeader 
                isAdmin={isAdmin} 
                onNewProject={() => { setMode('create'); setIsModalOpen(true); }} 
            />

            <CreateProjectModal
                key={selectedProject?.id || 'new'}
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}
                onSuccess={fetchData}
                heroes={heroes}
                project={selectedProject}
                mode={mode}
            />

            <DashboardFilters
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                filterHero={filterHero} setFilterHero={setFilterHero}
                heroes={heroes}
                resultsCount={paginatedProjects.length}
                totalCount={filteredProjects.length}
            />

            <ProjectTable
                projects={paginatedProjects}
                isAdmin={isAdmin}
                onView={(p) => { setSelectedProject(p); setMode('view'); setIsModalOpen(true); }}
                onEdit={(p) => { setSelectedProject(p); setMode('edit'); setIsModalOpen(true); }}
                onDelete={handleDelete}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
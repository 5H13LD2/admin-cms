import { useState, useEffect } from 'react';
import { useModulesPage, type Module, type ModuleFormData } from '../hooks/useModuleData';
import '../styles/global.css';

export default function Modules() {
  const {
    courses,
    coursesLoading,
    modules,
    modulesLoading,
    modulesError,
    selectedCourseId,
    setSelectedCourseId,
    handleCreateModule,
    createLoading,
    handleUpdateModule,
    updateLoading,
    handleDeleteModule,
    deleteLoading,
    totalModules,
    activeModules,
    totalLessons,
    totalDuration,
  } = useModulesPage();

  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loading = coursesLoading || modulesLoading || createLoading || updateLoading || deleteLoading;

  // Form state for create
  const [newModule, setNewModule] = useState<ModuleFormData>({
    title: '',
    description: '',
    courseId: '',
    status: 'active',
  });

  // Form state for edit
  const [editModuleData, setEditModuleData] = useState<ModuleFormData>({
    title: '',
    description: '',
    courseId: '',
    status: 'active',
  });

  // Filter modules when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredModules(modules);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = modules.filter(module => {
        return (
          module.title.toLowerCase().includes(searchLower) ||
          module.description.toLowerCase().includes(searchLower) ||
          ((module as any).courseName && (module as any).courseName.toLowerCase().includes(searchLower))
        );
      });
      setFilteredModules(filtered);
    }
  }, [searchTerm, modules]);

  // Show error from modulesError
  useEffect(() => {
    if (modulesError) {
      showAlertMessage('error', modulesError);
    }
  }, [modulesError]);

  const showAlertMessage = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmitCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleCreateModule(newModule);
    if (result) {
      showAlertMessage('success', 'Module created successfully!');
      setShowAddModal(false);
      setNewModule({
        title: '',
        description: '',
        courseId: '',
        status: 'active',
      });
    } else {
      showAlertMessage('error', 'Failed to create module');
    }
  };

  const handleSubmitUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    const result = await handleUpdateModule(selectedModule.id, selectedModule.courseId, editModuleData);
    if (result) {
      showAlertMessage('success', 'Module updated successfully!');
      setShowEditModal(false);
      setSelectedModule(null);
    } else {
      showAlertMessage('error', 'Failed to update module');
    }
  };

  const handleSubmitDeleteModule = async (module: Module) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    const result = await handleDeleteModule(module.id, module.courseId);
    if (result) {
      showAlertMessage('success', 'Module deleted successfully!');
    } else {
      showAlertMessage('error', 'Failed to delete module');
    }
  };

  const openEditModal = (module: Module) => {
    setSelectedModule(module);
    setEditModuleData({
      title: module.title,
      description: module.description,
      courseId: module.courseId,
      status: (module.status as 'active' | 'inactive') || 'active',
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1001, minWidth: '300px' }}>
          {alert.message}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p style={{ color: 'white', marginTop: '1rem' }}>Loading...</p>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="page-title">Module Management</h1>
          <div className="flex gap-2">
            {/* Course Filter */}
            <select
              className="form-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={coursesLoading}
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title || course.courseName}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="search-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: '#6b7280'
                  }}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Add Button */}
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i> Add Module
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="stats-card">
            <i className="fas fa-cubes stats-icon"></i>
            <div className="stats-content">
              <h3>{totalModules}</h3>
              <p>Total Modules</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-check-circle stats-icon" style={{ color: '#10b981' }}></i>
            <div className="stats-content">
              <h3>{activeModules}</h3>
              <p>Active Modules</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-book-open stats-icon" style={{ color: '#3b82f6' }}></i>
            <div className="stats-content">
              <h3>{totalLessons}</h3>
              <p>Total Lessons</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-clock stats-icon" style={{ color: '#f59e0b' }}></i>
            <div className="stats-content">
              <h3>{totalDuration}</h3>
              <p>Total Minutes</p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <div key={module.id} className="card">
                <div className="card-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title">{module.title}</h3>
                    <span className={`badge ${module.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                      {module.status || 'active'}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-muted">{module.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <small className="text-muted">Course:</small>
                      <p className="font-weight-bold">{(module as any).courseName || module.courseId}</p>
                    </div>
                    <div>
                      <small className="text-muted">Order:</small>
                      <p className="font-weight-bold">{module.order || 0}</p>
                    </div>
                    {module.totalLessons !== undefined && (
                      <div>
                        <small className="text-muted">Lessons:</small>
                        <p className="font-weight-bold">{module.totalLessons}</p>
                      </div>
                    )}
                    {module.estimatedMinutes !== undefined && (
                      <div>
                        <small className="text-muted">Duration:</small>
                        <p className="font-weight-bold">{module.estimatedMinutes} min</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => openEditModal(module)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleSubmitDeleteModule(module)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-cubes"></i>
            <h3>No modules found</h3>
            <p>
              {searchTerm
                ? 'Try adjusting your search criteria'
                : selectedCourseId
                ? 'No modules available for this course'
                : 'Start by creating your first module'}
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i> Create First Module
            </button>
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fas fa-plus-circle"></i> Add New Module
              </h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitCreateModule}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Module Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newModule.title}
                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    className="form-select"
                    value={newModule.courseId}
                    onChange={(e) => setNewModule({ ...newModule, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title || course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newModule.order || ''}
                    onChange={(e) => setNewModule({ ...newModule, order: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={newModule.status}
                    onChange={(e) => setNewModule({ ...newModule, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-plus"></i> Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {showEditModal && selectedModule && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fas fa-edit"></i> Edit Module
              </h3>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitUpdateModule}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Module Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModuleData.title}
                    onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editModuleData.description}
                    onChange={(e) => setEditModuleData({ ...editModuleData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    className="form-select"
                    value={editModuleData.courseId}
                    onChange={(e) => setEditModuleData({ ...editModuleData, courseId: e.target.value })}
                    required
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title || course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editModuleData.order || ''}
                    onChange={(e) => setEditModuleData({ ...editModuleData, order: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={editModuleData.status}
                    onChange={(e) => setEditModuleData({ ...editModuleData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> Update Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

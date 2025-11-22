import { useState, useEffect } from 'react';
import { useCoursesPage, useCourseModules, type Course, type Module, type CourseFormData } from '../hooks/useCourseData';
import '../styles/global.css';

export default function Courses() {
  const {
    courses,
    coursesLoading,
    coursesError,
    handleCreateCourse,
    createLoading,
    handleUpdateCourse,
    updateLoading,
    handleDeleteCourse,
    deleteLoading,
  } = useCoursesPage();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { modules: courseModules, loading: modulesLoading } = useCourseModules(showModulesModal ? selectedCourse?.id || null : null);

  const loading = coursesLoading || createLoading || updateLoading || deleteLoading;

  // Form state for create
  const [newCourse, setNewCourse] = useState<CourseFormData>({
    title: '',
    description: '',
    status: 'draft',
  });

  // Form state for edit
  const [editCourseData, setEditCourseData] = useState<CourseFormData>({
    title: '',
    description: '',
    status: 'draft',
  });

  // Statistics (matching techlaunch)
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, course) =>
    acc + (course.enrolledStudents || course.enrolledUsers?.length || 0), 0);
  const activeCourses = courses.filter(course =>
    course.status === 'active' || course.status === 'published').length;
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
    : '0.0';

  // Filter courses when search term changes (matching techlaunch)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = courses.filter(course => {
        const title = course.title || course.courseName || '';
        return (
          title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          (course.language && course.language.toLowerCase().includes(searchLower)) ||
          (course.difficulty && course.difficulty.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  // Show error from coursesError
  useEffect(() => {
    if (coursesError) {
      showAlertMessage('error', coursesError);
    }
  }, [coursesError]);

  const showAlertMessage = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmitCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleCreateCourse(newCourse);
    if (result) {
      showAlertMessage('success', 'Course created successfully!');
      setShowAddModal(false);
      setNewCourse({
        title: '',
        description: '',
        status: 'draft',
      });
    } else {
      showAlertMessage('error', 'Failed to create course');
    }
  };

  const handleSubmitUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const result = await handleUpdateCourse(selectedCourse.id, editCourseData);
    if (result) {
      showAlertMessage('success', 'Course updated successfully!');
      setShowEditModal(false);
      setSelectedCourse(null);
    } else {
      showAlertMessage('error', 'Failed to update course');
    }
  };

  const handleSubmitDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const result = await handleDeleteCourse(id);
    if (result) {
      showAlertMessage('success', 'Course deleted successfully!');
    } else {
      showAlertMessage('error', 'Failed to delete course');
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditCourseData({
      title: course.title || course.courseName || '',
      description: course.description,
      status: (course.status as 'draft' | 'published') || 'draft',
    });
    setShowEditModal(true);
  };

  const handlePublishToggle = async (course: Course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    const result = await handleUpdateCourse(course.id, { status: newStatus });
    if (result) {
      showAlertMessage('success', `Course ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully!`);
    } else {
      showAlertMessage('error', 'Failed to update course status');
    }
  };

  const openModulesModal = async (course: Course) => {
    setSelectedCourse(course);
    setShowModulesModal(true);
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
        {/* Header (matching techlaunch) */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="page-title">Course Management</h1>
          <div className="flex gap-2">
            <div className="search-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
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
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i> Add New Course
            </button>
          </div>
        </div>

        {/* Statistics (matching techlaunch) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="stats-card">
            <i className="fas fa-book stats-icon"></i>
            <div className="stats-content">
              <h3>{totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-users stats-icon"></i>
            <div className="stats-content">
              <h3>{totalEnrollments}</h3>
              <p>Total Enrollments</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-chart-line stats-icon" style={{ color: '#10b981' }}></i>
            <div className="stats-content">
              <h3>{activeCourses}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-star stats-icon" style={{ color: '#f59e0b' }}></i>
            <div className="stats-content">
              <h3>{avgRating}</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="card">
                <div className="card-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title">{course.title || course.courseName}</h3>
                    <span
                      className={`badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'}`}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {course.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn"
                      onClick={() => handlePublishToggle(course)}
                      title={course.status === 'published' ? 'Move to draft' : 'Publish course'}
                      style={{ color: course.status === 'published' ? '#10b981' : '#f59e0b' }}
                    >
                      <i className={`fas ${course.status === 'published' ? 'fa-eye-slash' : 'fa-rocket'}`}></i>
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => openEditModal(course)}
                      title="Edit course"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleSubmitDeleteCourse(course.id)}
                      title="Delete course"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <p className="text-sm mb-3" style={{ color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                <div className="flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#6b7280' }}>
                    <span><i className="fas fa-users"></i> {course.enrolledUsers?.length || 0} enrolled</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    onClick={() => openModulesModal(course)}
                  >
                    <i className="fas fa-cubes"></i> Modules
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h3>No Courses Found</h3>
            <p>{searchTerm ? 'Try adjusting your search' : 'Start by creating your first course'}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i> Create First Course
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}><i className="fas fa-plus-circle"></i> Create New Course</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitCreateCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.title || ''}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                    placeholder="e.g., Java Programming Mastery"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                    placeholder="Describe what students will learn in this course..."
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newCourse.status}
                    onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value as 'draft' | 'published' })}
                  >
                    <option value="draft">Draft (Not visible to students)</option>
                    <option value="published">Published (Visible to students)</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {newCourse.status === 'published' ? 'Create & Publish' : 'Save as Draft'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}><i className="fas fa-edit"></i> Edit Course</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitUpdateCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editCourseData.title || ''}
                    onChange={(e) => setEditCourseData({ ...editCourseData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={editCourseData.description}
                    onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editCourseData.status}
                    onChange={(e) => setEditCourseData({ ...editCourseData, status: e.target.value as 'draft' | 'published' })}
                  >
                    <option value="draft">Draft (Not visible to students)</option>
                    <option value="published">Published (Visible to students)</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modules Modal */}
      {showModulesModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowModulesModal(false)}>
          <div className="modal-content" style={{ width: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}><i className="fas fa-cubes"></i> {selectedCourse.title || selectedCourse.courseName} - Modules</h2>
              <button onClick={() => setShowModulesModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              {courseModules.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {courseModules.map((module) => (
                    <div key={module.id} className="card" style={{ marginBottom: 0 }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{module.title}</h4>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{module.description}</p>
                      <div className="flex items-center gap-3 text-sm" style={{ color: '#6b7280' }}>
                        <span><i className="fas fa-clock"></i> {module.estimatedMinutes} min</span>
                        <span><i className="fas fa-book-open"></i> {module.totalLessons} lessons</span>
                        <span><i className="fas fa-sort-numeric-up"></i> Order: {module.order}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-cubes"></i>
                  <h3>No Modules Found</h3>
                  <p>This course doesn't have any modules yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

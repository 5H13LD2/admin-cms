import { useState, useEffect } from 'react';
import { courseAPI, type Course, type Module, type CreateCourseData } from '../services/api';
import '../styles/global.css';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModules, setCourseModules] = useState<Module[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state for create
  const [newCourse, setNewCourse] = useState<CreateCourseData>({
    title: '',
    description: '',
    difficulty: 'Beginner',
    language: 'Python',
    duration: 0,
    thumbnail: '',
    status: 'active',
  });

  // Form state for edit
  const [editCourseData, setEditCourseData] = useState<CreateCourseData>({
    title: '',
    description: '',
    difficulty: 'Beginner',
    language: 'Python',
    duration: 0,
    thumbnail: '',
  });

  // Statistics
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0);
  const activeCourses = courses.filter(course => course.status === 'active').length;
  const avgRating = courses.length > 0
    ? (courses.reduce((acc, course) => acc + (course.rating || 0), 0) / courses.length).toFixed(1)
    : '0.0';

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Filter courses when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await courseAPI.createCourse(newCourse);
      showAlert('success', 'Course created successfully!');
      setShowAddModal(false);
      setNewCourse({
        title: '',
        description: '',
        difficulty: 'Beginner',
        language: 'Python',
        duration: 0,
        thumbnail: '',
        status: 'active',
      });
      await loadCourses();
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setLoading(true);
    try {
      await courseAPI.updateCourse(selectedCourse.id, editCourseData);
      showAlert('success', 'Course updated successfully!');
      setShowEditModal(false);
      setSelectedCourse(null);
      await loadCourses();
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    try {
      await courseAPI.deleteCourse(id);
      showAlert('success', 'Course deleted successfully!');
      await loadCourses();
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditCourseData({
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      language: course.language,
      duration: course.duration,
      thumbnail: course.thumbnail || '',
    });
    setShowEditModal(true);
  };

  const openModulesModal = async (course: Course) => {
    setSelectedCourse(course);
    setShowModulesModal(true);
    try {
      const response = await courseAPI.getCourseModules(course.id);
      setCourseModules(response.data);
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to load modules');
      setCourseModules([]);
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-danger';
      default: return 'badge-primary';
    }
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
          <h1 className="page-title">Course Management</h1>
          <div className="flex gap-2">
            <div className="search-container">
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i> Add New Course
            </button>
          </div>
        </div>

        {/* Statistics */}
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
            <i className="fas fa-chart-line stats-icon"></i>
            <div className="stats-content">
              <h3>{activeCourses}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stats-card">
            <i className="fas fa-star stats-icon"></i>
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
                  <h3 className="card-title">{course.title}</h3>
                  <div className="card-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => openEditModal(course)}
                      title="Edit course"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteCourse(course.id)}
                      title="Delete course"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${getDifficultyBadgeClass(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    <i className="fas fa-code" style={{ color: 'var(--primary-color)' }}></i> {course.language}
                  </span>
                </div>

                <p className="text-sm mb-3" style={{ color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                <div className="flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#6b7280' }}>
                    <span><i className="fas fa-users"></i> {course.enrolledStudents || 0}</span>
                    <span><i className="fas fa-clock"></i> {course.duration}h</span>
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
              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={newCourse.difficulty}
                      onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={newCourse.language}
                      onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                    >
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="SQL">SQL</option>
                      <option value="C++">C++</option>
                      <option value="React">React</option>
                      <option value="Node.js">Node.js</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (hours)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Thumbnail URL (optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Course</button>
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
              <form onSubmit={handleUpdateCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editCourseData.title}
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={editCourseData.difficulty}
                      onChange={(e) => setEditCourseData({ ...editCourseData, difficulty: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={editCourseData.language}
                      onChange={(e) => setEditCourseData({ ...editCourseData, language: e.target.value })}
                    >
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="SQL">SQL</option>
                      <option value="C++">C++</option>
                      <option value="React">React</option>
                      <option value="Node.js">Node.js</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (hours)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editCourseData.duration}
                    onChange={(e) => setEditCourseData({ ...editCourseData, duration: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Thumbnail URL (optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    value={editCourseData.thumbnail}
                    onChange={(e) => setEditCourseData({ ...editCourseData, thumbnail: e.target.value })}
                  />
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
              <h2 style={{ margin: 0 }}><i className="fas fa-cubes"></i> {selectedCourse.title} - Modules</h2>
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

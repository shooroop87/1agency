// Получить массив ID
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {
    return [];
  }
}

// Добавить в favorites
function addFavorite(id) {
  const favorites = getFavorites();
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

// Удалить из favorites
function removeFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

// Переключить состояние
function toggleFavorite(id) {
  const favorites = getFavorites();
  if (favorites.includes(id)) {
    removeFavorite(id);
    return false;
  } else {
    addFavorite(id);
    return true;
  }
}

// Проверить, есть ли в избранном
function hasFavorite(id) {
  return getFavorites().includes(id);
}

// Обновить счётчик в хедере
function updateFavoritesCount() {
  const count = getFavorites().length;
  document.querySelectorAll('.favorites-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';  // flex вместо inline
  });
}

// Обновить состояние всех кнопок на странице
function updateAllFavoriteButtons() {
  const favorites = getFavorites();
  document.querySelectorAll('.favorites-btn[data-property-id]').forEach(btn => {
    const id = btn.dataset.propertyId;
    btn.classList.toggle('is-active', favorites.includes(id));
  });
}

// Глобальный объект Favorites
window.Favorites = {
  get: getFavorites,
  add: addFavorite,
  remove: removeFavorite,
  toggle: toggleFavorite,
  has: hasFavorite,
  updateCount: updateFavoritesCount,
  updateButtons: updateAllFavoriteButtons
};

// Для обратной совместимости
window.getFavorites = getFavorites;
window.removeFavorite = removeFavorite;
window.updateFavoritesCount = updateFavoritesCount;

// Обработчик клика (делегирование — работает с динамическими элементами)
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.favorites-btn[data-property-id]');
  if (!btn) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const id = btn.dataset.propertyId;
  if (!id) return;
  
  const isNowActive = toggleFavorite(id);
  btn.classList.toggle('is-active', isNowActive);
  
  updateFavoritesCount();
  updateAllFavoriteButtons();
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  updateFavoritesCount();
  updateAllFavoriteButtons();
});
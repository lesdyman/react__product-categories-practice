/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import 'bulma/css/bulma.css';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => product.categoryId === item.id,
  );
  const user = usersFromServer.find(
    person => category && person.id === category.ownerId,
  );

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [visibleList, setVisibleList] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  function sortByName(name) {
    const sortedByName = products.filter(
      product => product.user?.name === name,
    );

    setVisibleList(sortedByName);
  }

  function sortByCategory(categoryTitle) {
    const sortedByCategory = products.filter(
      product => product.category?.title === categoryTitle,
    );

    setVisibleList(sortedByCategory);
  }

  function sortByQuery(event) {
    const query = event.target.value.toLowerCase();

    setSearchQuery(query);

    const filteredProducts = products.filter(product => {
      const productName = product.name.toLowerCase();
      const categoryName = product.category?.title.toLowerCase();
      const userName = product.user?.name.toLowerCase();

      return (
        productName.includes(query) ||
        categoryName?.includes(query) ||
        userName?.includes(query)
      );
    });

    setVisibleList(filteredProducts);
  }

  return (
    <>
      <div className="section">
        <div className="container">
          <h1 className="title">Product Categories</h1>

          <div className="block">
            <nav className="panel">
              <p className="panel-heading">Filters</p>

              <p className="panel-tabs has-text-weight-bold">
                <a
                  onClick={() => {
                    setVisibleList(products);
                    setSelectedUser('all');
                  }}
                  data-cy="FilterAllUsers"
                  href="#/"
                  className={selectedUser === 'all' ? 'is-active' : ''}
                >
                  All
                </a>

                {usersFromServer.map(user => (
                  <a
                    onClick={() => {
                      sortByName(user.name);
                      setSelectedUser(user.name);
                    }}
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={selectedUser === user.name ? 'is-active' : ''}
                  >
                    {user.name}
                  </a>
                ))}
              </p>

              <div className="panel-block">
                <p className="control has-icons-left has-icons-right">
                  <input
                    data-cy="SearchField"
                    type="text"
                    className="input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={sortByQuery}
                  />

                  <span className="icon is-left">
                    <i className="fas fa-search" aria-hidden="true" />
                  </span>

                  <span className="icon is-right">
                    {searchQuery.length > 0 && (
                      <button
                        onClick={() => {
                          setVisibleList(products);
                          setSearchQuery('');
                        }}
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                      />
                    )}
                  </span>
                </p>
              </div>

              <div className="panel-block is-flex-wrap-wrap">
                <a
                  onClick={() => {
                    setVisibleList(products);
                  }}
                  href="#/"
                  data-cy="AllCategories"
                  className="button is-success mr-6 is-outlined"
                >
                  All
                </a>

                {categoriesFromServer.map(category => (
                  <a
                    onClick={() => {
                      sortByCategory(category.title);
                      setSelectedCategory(category.title);
                    }}
                    data-cy="Category"
                    href="#/"
                    className={`button mr-2 my-1 ${selectedCategory === category.title ? 'is-info' : ''}`}
                  >
                    {category.title}
                  </a>
                ))}
              </div>

              <div className="panel-block">
                <a
                  onClick={() => {
                    setVisibleList(products);
                  }}
                  data-cy="ResetAllButton"
                  href="#/"
                  className="button is-link is-outlined is-fullwidth"
                >
                  Reset all filters
                </a>
              </div>
            </nav>
          </div>

          <div className="box table-container">
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>

            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleList.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category?.icon} - {product.category?.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={`has-text-link ${product.user?.sex === 'f' ? 'has-text-danger' : 'has-text-weight-light'}`}
                    >
                      {product.user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

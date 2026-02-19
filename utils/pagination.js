/**
 * Pagination utility for MongoDB queries
 * @param {Object} query - Mongoose query object
 * @param {Object} req - Express request object
 * @param {Object} options - Additional options
 * @returns {Object} - Paginated results with metadata
 */
export const paginate = async (query, req, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = null,
    populate = null
  } = { ...options, ...req.query };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await query.countDocuments();

  // Build the query
  let queryBuilder = query
    .skip(skip)
    .limit(limitNum)
    .sort(sort);

  if (select) {
    queryBuilder = queryBuilder.select(select);
  }

  if (populate) {
    queryBuilder = queryBuilder.populate(populate);
  }

  // Execute query
  const data = await queryBuilder;

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  return {
    data,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNum,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNum + 1 : null,
      prevPage: hasPrevPage ? pageNum - 1 : null,
    },
  };
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Object} result - Paginated result from paginate function
 * @param {Object} additionalData - Additional data to include in response
 */
export const sendPaginatedResponse = (res, result, additionalData = {}) => {
  res.status(200).json({
    success: true,
    count: result.data.length,
    ...result.pagination,
    ...additionalData,
    data: result.data,
  });
};

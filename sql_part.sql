-- using MySQL v5.7

-- How many organizations do not have account plans?
SELECT COUNT(*) 
FROM organization o
WHERE NOT EXISTS (SELECT 1 FROM account a WHERE o.id = a.organizationId);

-- How many organizations have more than one account plan?
SELECT COUNT(*)
FROM (
    SELECT o.id
    FROM organization o
    JOIN account a ON o.id = a.organizationId
    GROUP BY o.id
    HAVING COUNT(a.id) > 1
) as t;

-- List all organizations that have only one account plan.
SELECT o.id, o.orgName
FROM organization o
JOIN account a ON o.id = a.organizationId
GROUP BY o.id
HAVING COUNT(a.id) = 1;

-- List all organizations that have the PASSWORDLESS feature set to true.
SELECT o.id, o.orgName
FROM organization o
JOIN account a ON o.id = a.organizationId
WHERE JSON_EXTRACT(a.features, '$.PASSWORDLESS') = true; 
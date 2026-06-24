SELECT rc.id,
    JSON_BUILD_OBJECT(
        'id',
        parent.id,
        'name',
        parent.name,
        'path',
        parent.path,
        'controlChildrens',
        COALESCE(
            (
                SELECT JSON_AGG(
                        JSON_BUILD_OBJECT (
                            'id',
                            child.id,
                            'name',
                            child.name,
                            'path',
                            child.path
                        )
                    )
                FROM control child
                WHERE child.parent_id = parent.id
            ),
            '[]'::JSON
        )
    ) AS control
FROM role_control rc
    JOIN control parent ON parent.id = rc.control_id
WHERE rc.role_id = $1;
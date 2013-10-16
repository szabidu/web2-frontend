<?php

namespace Radio\Permissions;

use Zend\ServiceManager\ServiceLocatorAwareInterface,
    Zend\Permissions\Acl\Assertion\AssertionInterface,
    Zend\Permissions\Acl\Acl as ZendAcl,
    Zend\Permissions\Acl\Role\RoleInterface,
    Zend\Permissions\Acl\Resource\ResourceInterface,
    Radio\Provider\ServiceLocator,
    Radio\Provider\EntityManager,
    Radio\Entity\User;

class RoleAssertion implements AssertionInterface, ServiceLocatorAwareInterface {
    use ServiceLocator;
    use EntityManager;
    
    private $user;
    private $recordId;
    
    /**
     * Construct role validation object
     * 
     * @param User $user The user whos rights are going to be tested
     * @param type $recordId Id of the database record against which the permission will be tested
     */
    public function __construct($user, $recordId)
    {
        $this->user = $user;
        $this->recordId = $recordId;
    }
    
    /**
     * Database record level permission control
     * 
     * @param \Zend\Permissions\Acl\Acl $acl
     * @param \Zend\Permissions\Acl\Role\RoleInterface $role
     * @param \Zend\Permissions\Acl\Resource\ResourceInterface $resource
     * @param type $privilege
     */
    public function assert(ZendAcl $acl, RoleInterface $role = null, ResourceInterface $resource = null, $action = null) {
        if (empty($this->user))
            // unauthorizued user, permission check not possible (role level permissions apply)
            return true;
        
        // check author permissions
        if ($role->getRoleId() == 'author')
        {
            // user wants to gain access to a show
            if ($resource->getResourceId('Radio\Controller\Show'))
            {
                // check if the user want's to call the 'update' or 'delete' methods
                // note: only admins can access 'create'
                if (in_array($action, array('update', 'delete')))
                {
                    // check if the author belongs to this show
                    $record = $this->getEntityManager()->find("\Radio\Entity\Show", $this->recordId);
                    var_dump($record);
                    die();
                    /*
                     * if (this show doesn't belong to this author) 
                     *     return false;
                     */
                }
            }
        }
        return true;
    }
}

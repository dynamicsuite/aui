<?php
/*
 * Aui Package
 * Copyright (C) 2020 Dynamic Suite Team
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 */

namespace DynamicSuite\Pkg\Aui;
use DynamicSuite\Core\Instance;

$cfg = new Config('aui');
$min = '/dynamicsuite/packages/aui/js/aui.min.js';
$full = '/dynamicsuite/packages/aui/js/aui.js';

/** @var Instance $ds */
if (!in_array($cfg->use_minified ? $min : $full, $ds->packages->resources->js)) {
    $ds->packages->resources->addResource('js', $cfg->use_minified ? $min : $full, 'aui');
    $ds->view->initCoreResources();
    $ds->save();
}